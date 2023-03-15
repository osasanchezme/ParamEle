// import data from "./data/template-4-two-beams.json";
// import data from "./data/template-0.json";
import data from "./data/template-5-frame.json";
import logic_runner from "./js/globalLogicRunner";
import getState from "./getState";
import utils from "./utils";
import repair from "./js/repair";

const initial_state = {
  model: repair.repairModel(data.model),
  settings: repair.repairSettings(data.settings),
  structure: utils.getEmptyStructuralModel(),
  globals: {
    last_node_id_created: "",
  },
  section_colors: [null, "#505050", "#42810A", "#DB7093", "#F4A53A", "#843D80", "#2A56CD", "#D26A34"]
};

function setInitialState() {
  window.ParamEle = {};
  window.ParamEle.rfInstance = undefined;
  window.ParamEle.state = initial_state;
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

function getRfInstance() {
  return window.ParamEle.rfInstance;
}

function updateSettingsFromLocalState(settings_obj) {
  Object.entries(settings_obj.general).forEach(([key, value]) => {
    window.ParamEle.changeGeneralSettingValue(key, value);
  });
}

function updateStateFromFlow(force_update = false) {
  let settings = getState("settings")["general"];
  if (settings.auto_update) {
    // TODO -  Do not do it with timeout but using a callback in index.js
    setTimeout(() => {
      let rfInstance = getRfInstance();
      if (rfInstance) {
        let current_state = getState();
        let old_state = JSON.stringify(current_state);
        current_state.model.nodes = rfInstance.getNodes();
        current_state.model.edges = rfInstance.getEdges();
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
function addNodeToTheEditor(type, html_position, data = {}) {
  let rfInstance = getRfInstance();
  let position = rfInstance.project(html_position);
  let id = utils.nextNodeId();
  setGlobalVariable("last_node_id_created", id);
  rfInstance.addNodes([{ id, type, position, data }]);
}

function getSectionColor(section_id){
  let section_color = window.ParamEle.state.section_colors[section_id];
  if (typeof section_color === "undefined") defineSectionColor(section_id);
  return window.ParamEle.state.section_colors[section_id];
}

function defineSectionColor(section_id){
  window.ParamEle.state.section_colors[Number(section_id)] = '#' + parseInt(Math.random() * 0xffffff).toString(16);
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
  getSectionColor
};

export default state;
