// import data from "./data/template-4-two-beams.json";
// import data from "./data/template-0.json";
// import data from "./data/template-5-frame.json";
import data from "./data/template-quad-wrapper.json";
// import data from "./data/template-math-quadratic.json";
// import data from "./data/template-simple-beam-wrapper.json";
import logic_runner from "./js/globalLogicRunner";
import getState from "./getState";
import utils from "./utils";
import repair from "./js/repair";
import notification from "./components/notification";
import { ReactFlowInstance } from "react-flow-renderer";
const { notify } = notification;

function setInitialState() {
  // Get language from URL
  let url_params = new URLSearchParams(window.location.search);
  let language = url_params.get("lang");
  if (language === null) language = "es";
  // Set the initial state
  window.ParamEle = {};
  window.ParamEle.rfInstance = undefined;
  window.ParamEle.state = {
    model: repair.repairModel(data.model),
    settings: repair.repairSettings(data.settings),
    structure: utils.getEmptyStructuralModel(),
    globals: {
      last_node_id_created: "",
      current_resizer: "",
      selected_handles: [],
      user_interaction_step: "none", // Can be "none", "wait", "done"
    },
    section_colors: [null, "#505050", "#42810A", "#DB7093", "#F4A53A", "#843D80", "#2A56CD", "#D26A34"],
    language,
    words_map: {},
    model_path: ["model"], // Path to the current editable model in the state
    model_path_print: ["model"], // Path to the current editable model in the state
  };
  updateWordsMapFromLanguage();
}

function updateWordsMapFromLanguage() {
  const words_map = require(`./data/languages/${window.ParamEle.state.language}.json`);
  window.ParamEle.state.words_map = words_map;
}

function storeRfInstance(rfInstance) {
  window.ParamEle.rfInstance = rfInstance;
}

function setState(state, key) {
  if (key !== undefined) {
    window.ParamEle.state[key] = JSON.parse(JSON.stringify(state));
  } else {
    Object.entries(state).forEach(([state_key, state_val]) => {
      window.ParamEle.state[state_key] = JSON.parse(JSON.stringify(state_val));
    });
  }
}

function setGlobalVariable(key, value) {
  window.ParamEle.state.globals[key] = value;
}

function getGlobalVariable(key) {
  return window.ParamEle.state.globals[key];
}

/**
 *
 * @returns {ReactFlowInstance}
 */
function getRfInstance() {
  return window.ParamEle.rfInstance;
}

function getModelFromRfInstance() {
  let rfInstance = getRfInstance();
  return {
    nodes: rfInstance.getNodes(),
    edges: rfInstance.getEdges(),
  };
}

function updateSettingsFromLocalState(settings_obj) {
  Object.entries(settings_obj.general).forEach(([key, value]) => {
    window.ParamEle.changeGeneralSettingValue(key, value);
  });
}

function updateStateFromFlow(force_update = false) {
  let settings = getState("settings")["general"];
  let model_path = getState("model_path");
  if (settings.auto_update) {
    // TODO -  Do not do it with timeout but using a callback in index.js
    setTimeout(() => {
      let rfInstance = getRfInstance();
      if (rfInstance) {
        let current_state = getState();
        let old_state = JSON.stringify(current_state);
        let model_location = current_state;
        model_path.forEach((key) => {
          model_location = model_location[key];
        });
        model_location.nodes = rfInstance.getNodes();
        model_location.edges = rfInstance.getEdges();
        if (JSON.stringify(current_state) !== old_state || force_update) {
          setState(current_state);
          logic_runner.run();
        }
      }
    }, 100);
  }
}

/**
 *
 * @param {String} type Node type
 * @param {{x: Number, y: Number}} html_position Desired position for the node in the document space
 * @param {Object} [data] Initial data for the new node
 */
function addNodeToTheEditor(type, html_position, data = {}, is_rf_position = false, add_to_the_editor = true) {
  let rfInstance = getRfInstance();
  let position = html_position;
  if (!is_rf_position) {
    position = rfInstance.project(html_position);
  }
  let id = utils.nextNodeId();
  setGlobalVariable("last_node_id_created", id);
  if (add_to_the_editor) {
    rfInstance.addNodes([{ id, type, position, data }]);
  } else {
    return { id, type, position, data };
  }
}

function removeNodesAndEdgesFromModel(current_model, node_ids, edge_ids) {
  let { nodes, edges } = current_model;
  nodes.forEach((node, i) => {
    if (node_ids.includes(node.id)) nodes[i] = null;
  });
  edges.forEach((edge, i) => {
    if (edge_ids.includes(edge.id)) edges[i] = null;
  });
  let new_nodes = [];
  let new_edges = [];
  nodes.forEach((node) => {
    if (node !== null) new_nodes.push(node);
  });
  edges.forEach((edge) => {
    if (edge !== null) new_edges.push(edge);
  });
  return { nodes: new_nodes, edges: new_edges };
}

function updateNodeData(node_id, data_update) {
  let rf_instance = getRfInstance();
  rf_instance.setNodes((nds) =>
    nds.map((node) => {
      if (node.id === node_id) {
        node.data = {
          ...node.data,
          ...data_update,
        };
      }
      return node;
    })
  );
  updateStateFromFlow();
}

function zoomToCoordinate(x, y) {
  let rf_instance = getRfInstance();
  let width = 100;
  let height = 100;
  rf_instance.fitBounds({ x, y, width, height });
}

function resetView() {
  let rf_instance = getRfInstance();
  setTimeout(() => {
    rf_instance.fitView();
  }, 200);
}

function getSectionColor(section_id) {
  let section_color = window.ParamEle.state.section_colors[section_id];
  if (typeof section_color === "undefined") defineSectionColor(section_id);
  return window.ParamEle.state.section_colors[section_id];
}

function defineSectionColor(section_id) {
  window.ParamEle.state.section_colors[Number(section_id)] = "#" + parseInt(Math.random() * 0xffffff).toString(16);
}

function copyStructureToClipboard() {
  let structure = getState("structure");
  navigator.clipboard
    .writeText(JSON.stringify(structure))
    .then((value) => {
      notify("info", "copy", "", true);
    })
    .catch((value) => {
      notify("error", "copy_error", "", true);
    });
}

function highlightSelectedNodes(x_i, y_i, x_f, y_f, rel_orig_x, rel_orig_y) {
  // Swap the start and end if the selection was made from right to left or bottom to top
  if (x_i > x_f) {
    let old_x_i = x_i;
    x_i = x_f;
    x_f = old_x_i;
  }
  if (y_i > y_f) {
    let old_y_i = y_i;
    y_i = y_f;
    y_f = old_y_i;
  }
  x_i -= rel_orig_x;
  x_f -= rel_orig_x;
  y_i -= rel_orig_y;
  y_f -= rel_orig_y;
  let rf_instance = getRfInstance();
  let point_i = rf_instance.project({ x: x_i, y: y_i });
  let point_f = rf_instance.project({ x: x_f, y: y_f });
  rf_instance.setNodes((nds) =>
    nds.map((node) => {
      let { x, y } = node.position;
      if (x >= point_i.x && x <= point_f.x && y >= point_i.y && y <= point_f.y) {
        node.data.selected = node.data.selected ? false : true;
      }
      return node;
    })
  );
}

function deselectAllNodes() {
  let rf_instance = getRfInstance();
  rf_instance.setNodes((nds) =>
    nds.map((node) => {
      if (node.data.selected) node.data.selected = false;
      return node;
    })
  );
}

function selectHandle(event, node_id, handle_id, label, type) {
  let selected_handles = getGlobalVariable("selected_handles");
  let this_handle = {
    data_key_to_map: handle_id,
    node_id_to_map: node_id,
    label,
    type,
  };
  let is_already_selected = false;
  selected_handles.forEach(({ node_id_to_map, data_key_to_map }) => {
    if (node_id_to_map === node_id && data_key_to_map === handle_id) {
      is_already_selected = true;
    }
  });
  if (!is_already_selected) {
    selected_handles.push(this_handle);
  }
  setGlobalVariable("selected_handles", selected_handles);
}

function setModelToEditor(model) {
  let rf_instance = getRfInstance();
  let { nodes, edges } = model;
  rf_instance.setNodes(nodes);
  rf_instance.setEdges(edges);
}

const state = {
  setInitialState,
  setState,
  storeRfInstance,
  updateStateFromFlow,
  getRfInstance,
  updateSettingsFromLocalState,
  setGlobalVariable,
  getGlobalVariable,
  addNodeToTheEditor,
  getSectionColor,
  updateWordsMapFromLanguage,
  updateNodeData,
  zoomToCoordinate,
  copyStructureToClipboard,
  highlightSelectedNodes,
  deselectAllNodes,
  selectHandle,
  getModelFromRfInstance,
  removeNodesAndEdgesFromModel,
  setModelToEditor,
  resetView,
};

export default state;
