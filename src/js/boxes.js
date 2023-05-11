import getState from "../getState";
import { Node, Edge } from "react-flow-renderer";
import state from "../state";
import utils from "../utils";
import notification from "../components/notification";
const { notify, closeAllNotifications } = notification;

function groupBoxes() {
  /** @type {{nodes: Array<Node>, edges: Array<Edge>}} */
  let { nodes, edges } = getState("model");
  let selected_nodes = [];
  let selected_edges = [];
  let selected_node_ids = [];
  let selected_edge_ids = [];
  let connected_nodes = [];
  nodes.forEach((node) => {
    if (node.data.selected) {
      selected_nodes.push(node);
      selected_node_ids.push(node.id);
    }
  });
  if (selected_nodes.length === 0) {
    notify("warning", "no_nodes_selected", null, true);
    return;
  }
  // Get the connected edges to the selected nodes
  edges.forEach((edge) => {
    if (selected_node_ids.includes(edge.source) || selected_node_ids.includes(edge.target)) {
      connected_nodes.push(edge.source);
      connected_nodes.push(edge.target);
      selected_edges.push(edge);
      selected_edge_ids.push(edge.id);
    }
  });
  // Remove duplicates
  connected_nodes = [...new Set(connected_nodes)];
  // Check if the model is closed
  selected_node_ids.forEach((node_id) => {
    if (!connected_nodes.includes(node_id)) {
      notify("warning", "unconnected_nodes", null, true);
      return;
    }
  });
  // Create the wrapper node
  let internal_logic = {
    nodes: selected_nodes,
    edges: selected_edges,
  };

  // Get the center of the selected nodes
  let position = { x: 0, y: 0 };
  selected_nodes.forEach((node) => {
    position.x += node.position.x;
    position.y += node.position.y;
  });
  position.x /= selected_nodes.length;
  position.y /= selected_nodes.length;

  // Get the input handles
  getHandlesFromUserInteraction(groupBoxesStepTwo, { internal_logic, position, selected_node_ids, selected_edge_ids }, "select_input_handles");
}

function groupBoxesStepTwo(data_to_keep) {
  data_to_keep = { ...data_to_keep, input_handles: state.getGlobalVariable("selected_handles") };
  getHandlesFromUserInteraction(groupBoxesStepThree, data_to_keep, "select_output_handles");
}

function groupBoxesStepThree(data_to_keep) {
  data_to_keep = { ...data_to_keep, output_handles: state.getGlobalVariable("selected_handles") };
  let { internal_logic, input_handles, output_handles, position, selected_node_ids, selected_edge_ids } = data_to_keep;

  let { nodes, edges } = getState("model");
  // Add the wrapper node to the original model
  nodes.push(state.addNodeToTheEditor("nodesWrapper", position, { internal_logic, input_handles, output_handles }, true, false));

  // Remove the selected nodes and edges from the editor
  let new_model = state.removeNodesAndEdgesFromModel({ nodes, edges }, selected_node_ids, selected_edge_ids);
  state.setModelToEditor(new_model);

  // Zoom to the new node
  state.zoomToCoordinate(position.x, position.y);
}

function editInternalLogic() {
  /** @type {{nodes: Array<Node>, edges: Array<Edge>}} */
  let { nodes } = getState("model");
  let selected_nodes = [];
  let selected_node_ids = [];
  let selected_node_location = [];
  nodes.forEach((node, i) => {
    if (node.data.selected) {
      selected_nodes.push(node);
      selected_node_ids.push(node.id);
      selected_node_location.push(i);
    }
  });
  if (selected_nodes.length === 0) {
    notify("warning", "no_nodes_selected", null, true);
    return;
  }
  if (selected_nodes.length > 1) {
    notify("warning", "more_than_one_node_selected", null, true);
    return;
  }
  if (selected_nodes[0].type !== "nodesWrapper") {
    notify("warning", "no_wrapper_node", null, true);
    return;
  }
  let wrapper_node = selected_nodes[0];
  let wrapper_node_id = selected_node_ids[0];
  let wrapper_node_location = selected_node_location[0];
  let internal_logic = wrapper_node.data.internal_logic;
  let wrapper_node_name = wrapper_node.data.custom_label || wrapper_node_id;
  let model_path = getState("model_path");
  let model_path_print = getState("model_path_print");
  state.setState([...model_path, "nodes", wrapper_node_location, "data", "internal_logic"], "model_path");
  state.setState([...model_path_print, wrapper_node_name], "model_path_print");
  state.setModelToEditor(internal_logic);
  state.resetView();
  utils.updateNavigator();
}

function getHandlesFromUserInteraction(callback, data_to_keep, message_key) {
  utils.changeAppMode("selecting_handles");
  state.setGlobalVariable("selected_handles", []);
  state.setGlobalVariable("user_interaction_step", "wait");
  notify("info", message_key, null, true, 10000);
  let user_waiter = setInterval(() => {
    if (state.getGlobalVariable("user_interaction_step") === "done") {
      state.setGlobalVariable("user_interaction_step", "none");
      closeAllNotifications();
      callback(data_to_keep);
      clearInterval(user_waiter);
    }
  }, 100);
  setTimeout(() => {
    clearInterval(user_waiter);
  }, 10000);
}

const boxes = { groupBoxes, editInternalLogic };

export default boxes;
