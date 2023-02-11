import data from "./data/template-0.json";
import logic_runner from "./js/globalLogicRunner";

const initial_state = {
  model: data.model,
  settings: data.settings,
  structure: getEmptyStructuralModel(),
  globals: {
    last_node_id_created: "",
  },
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

function getEmptyStructuralModel() {
  return {
    dataVersion: 40,
    settings: {
      units: {
        length: "m",
        section_length: "mm",
        material_strength: "mpa",
        density: "kg/m3",
        force: "kn",
        moment: "kn-m",
        pressure: "kpa",
        mass: "kg",
        temperature: "degc",
        translation: "mm",
        stress: "mpa",
      },
      precision: "fixed",
      precision_values: 3,
      evaluation_points: 9,
      vertical_axis: "Y",
      member_offsets_axis: "local",
      projection_system: "orthographic",
      solver_timeout: 600,
      smooth_plate_nodal_results: true,
      extrapolate_plate_results_from_gauss_points: true,
      buckling_johnson: false,
      non_linear_tolerance: "1",
      non_linear_theory: "small",
      auto_stabilize_model: false,
      only_solve_user_defined_load_combinations: false,
      include_rigid_links_for_area_loads: false,
    },
    details: [],
    nodes: {},
    members: {},
    plates: {},
    meshed_plates: {},
    materials: {},
    sections: {},
    supports: {},
    settlements: {},
    groups: {},
    point_loads: {},
    moments: {},
    distributed_loads: {},
    pressures: {},
    area_loads: {},
    member_prestress_loads: {},
    thermal_loads: {},
    self_weight: {},
    load_combinations: {},
    load_cases: {},
    nodal_masses: {},
    nodal_masses_conversion_map: {},
    spectral_loads: {},
    notional_loads: {},
    suppress: {},
    gridlines_and_elevations: [],
    design_input: [],
  };
}

const state = {
  setInitialState,
  getState,
  setState,
  storeRfInstance,
  updateStateFromFlow,
  getRfInstance,
  updateSettingsFromLocalState,
  setGlobalVariable,
  getGlobalVariable,
};

export default state;
