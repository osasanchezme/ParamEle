import getState from "../getState";
import { Node, Edge } from "reactflow";
import state from "../state";
import utils from "../utils";
import notification from "../components/notification";
import { addNodeToTheEditor, deselectAllHandles, getSelectedHandles, removeNodesAndEdgesFromModel } from "../components/VisualEditor";
const { notify, closeAllNotifications } = notification;

function groupBoxes(finish_callback) {
  // Get the selected model
  let { selected_nodes, selected_edges, selected_node_ids, selected_edge_ids, connected_nodes } = getSelectedModel();

  // Check if there are nodes selected
  if (selected_nodes.length === 0) {
    notify("warning", "no_nodes_selected", null, true);
    return;
  }

  // Check if there are variableRange nodes selected
  let is_valid_selection = true;
  selected_nodes.forEach((node) => {
    if (node.type === "variableRange") {
      notify("warning", "range_nodes_selected_for_grouping", null, true);
      is_valid_selection = false;
    }
  });
  if (!is_valid_selection) return;

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
  getHandlesFromUserInteraction(
    groupBoxesStepTwo,
    { internal_logic, position, selected_node_ids, selected_edge_ids },
    "select_input_handles",
    finish_callback
  );
}

function groupBoxesStepTwo(data_to_keep, finish_callback) {
  let input_handles = getSelectedHandles();
  data_to_keep = { ...data_to_keep, input_handles };
  getHandlesFromUserInteraction(groupBoxesStepThree, data_to_keep, "select_output_handles", finish_callback);
}

function groupBoxesStepThree(data_to_keep, finish_callback) {
  let output_handles = getSelectedHandles();
  let { internal_logic, input_handles, position, selected_node_ids, selected_edge_ids } = data_to_keep;

  // Add the wrapper node to the editor
  addNodeToTheEditor("nodesWrapper", position, { internal_logic, input_handles, output_handles }, true, true);

  setTimeout(() => {
    removeNodesAndEdgesFromModel(selected_node_ids, selected_edge_ids);
    // Zoom to the new node
    state.zoomToCoordinate(position.x, position.y);

    // Call the finish callback
    finish_callback(true);
  }, 100);
}

function editInternalLogic() {
  /** @type {{nodes: Array<Node>, edges: Array<Edge>}} */
  let { nodes } = getState("model");
  let selected_nodes = [];
  let selected_node_ids = [];
  let selected_node_location = [];
  nodes.forEach((node, i) => {
    if (node.data.aux.selected) {
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

function getHandlesFromUserInteraction(callback, data_to_keep, message_key, finish_callback) {
  deselectAllHandles();
  state.setGlobalVariable("user_interaction_step", "wait");
  notify("info", message_key, null, true, 10000);
  let user_waiter = setInterval(() => {
    if (state.getGlobalVariable("user_interaction_step") === "done") {
      state.setGlobalVariable("user_interaction_step", "none");
      closeAllNotifications();
      callback(data_to_keep, finish_callback);
      clearInterval(user_waiter);
    }
  }, 100);
  setTimeout(() => {
    clearInterval(user_waiter);
  }, 10000);
}

function deleteBoxes() {
  /** @type {{nodes: Array<Node>, edges: Array<Edge>}} */
  let { nodes, edges } = getState("model");
  let selection = getSelectedModel();
  let new_nodes = [];
  let new_edges = [];
  nodes.forEach((node) => {
    if (!selection.selected_node_ids.includes(node.id)) new_nodes.push(node);
  });
  edges.forEach((edge) => {
    if (!selection.selected_edge_ids.includes(edge.id)) new_edges.push(edge);
  });
  state.setModelToEditor({ nodes: new_nodes, edges: new_edges });
}

function getSelectedModel() {
  /** @type {{nodes: Array<Node>, edges: Array<Edge>}} */
  let { nodes, edges } = getState("model");
  let selected_nodes = [];
  let selected_edges = [];
  let selected_node_ids = [];
  let selected_edge_ids = [];
  let connected_nodes = [];
  nodes.forEach((node) => {
    if (node.data.aux.selected) {
      selected_nodes.push(node);
      selected_node_ids.push(node.id);
    }
  });
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

  return { selected_nodes, selected_edges, selected_node_ids, selected_edge_ids, connected_nodes };
}

const boxes = { groupBoxes, editInternalLogic, deleteBoxes };

export default boxes;
