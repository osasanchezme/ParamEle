import data from "./data/template-0.json";
import logic_runner from "./js/globalLogicRunner";

const initial_state = {
  model: data.model,
  settings: data.settings,
};

function setInitialState() {
  window.ParamEle = {};
  window.ParamEle.rfInstance = undefined;
  window.ParamEle.state = initial_state;
}

function storeRfInstance(rfInstance) {
  window.ParamEle.rfInstance = rfInstance;
}

function getState(key) {
  let state = JSON.parse(JSON.stringify(window.ParamEle.state));
  if (key !== undefined) state = state[key];
  return state;
}

function setState(state, key) {
  if (key !== undefined) {
    window.ParamEle.state[key] = JSON.parse(JSON.stringify(state));
  } else {
    window.ParamEle.state = JSON.parse(JSON.stringify(state));
  }
}

function getRfInstance() {
  return window.ParamEle.rfInstance;
}

function updateSettingsFromLocalState(settings_obj) {
  Object.entries(settings_obj.general).forEach(([key, value]) => {
    window.ParamEle.changeGeneralSettingValue(key, value);
  });
}

function updateStateFromFlow() {
  console.log("Updating local state...");
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
        if (JSON.stringify(current_state) !== old_state) {
          setState(current_state);
          logic_runner.run();
        }
      }
    }, 100);
  }
}

const state = {
  setInitialState,
  getState,
  setState,
  storeRfInstance,
  updateStateFromFlow,
  getRfInstance,
  updateSettingsFromLocalState,
};

export default state;
