// import data from "./data/template-4-two-beams.json";
// import data from "./data/template-0.json";
// import data from "./data/template-5-frame.json";
// import data from "./data/template-quad-wrapper.json";
// import data from "./data/template-math-quadratic.json";
// import data from "./data/template-simple-beam-wrapper.json";
// import data from "./data/template-simple-beam-wrapper-with-slider.json";
import data from "./data/template-results-gather.json";
// import data from "./data/template-wrapper-frame-with-sliders.json";
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
    results: {
      "0": {
        "name": "LG",
        "type": "load_group",
        "reactions": {
          "1": {
            "Fx": 0,
            "Fy": 0,
            "Fz": 1.5,
            "Mx": 0,
            "My": -0.75,
            "Mz": 0
          },
          "2": {
            "Fx": 0,
            "Fy": 0,
            "Fz": 1.5,
            "Mx": 0,
            "My": 0.75,
            "Mz": 0
          }
        },
        "member_displacements": {
          "displacement_x": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "displacement_y": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "displacement_z": {
            "1": {
              "0.0": 0,
              "12.5": -0.024,
              "25.0": -0.071,
              "37.5": -0.111,
              "50.0": -0.127,
              "62.5": -0.111,
              "75.0": -0.071,
              "87.5": -0.024,
              "100.0": 0
            }
          },
          "displacement_sum": {
            "1": {
              "0.0": 0,
              "12.5": 0.024,
              "25.0": 0.071,
              "37.5": 0.111,
              "50.0": 0.127,
              "62.5": 0.111,
              "75.0": 0.071,
              "87.5": 0.024,
              "100.0": 0
            }
          },
          "displacement_local_x": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "displacement_local_y": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "displacement_local_z": {
            "1": {
              "0.0": 0,
              "12.5": -0.024,
              "25.0": -0.071,
              "37.5": -0.111,
              "50.0": -0.127,
              "62.5": -0.111,
              "75.0": -0.071,
              "87.5": -0.024,
              "100.0": 0
            }
          },
          "displacement_local_sum": {
            "1": {
              "0.0": 0,
              "12.5": 0.024,
              "25.0": 0.071,
              "37.5": 0.111,
              "50.0": 0.127,
              "62.5": 0.111,
              "75.0": 0.071,
              "87.5": 0.024,
              "100.0": 0
            }
          },
          "rotation_x": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "rotation_y": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "rotation_z": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "rotation_local_x": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "rotation_local_y": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "rotation_local_z": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          }
        },
        "member_forces": {
          "axial_force": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "shear_force_y": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "shear_force_z": {
            "1": {
              "0.0": 1.5,
              "12.5": 1.125,
              "25.0": 0.75,
              "37.5": 0.375,
              "50.0": 0,
              "62.5": -0.375,
              "75.0": -0.75,
              "87.5": -1.125,
              "100.0": -1.5
            }
          },
          "bending_moment_y": {
            "1": {
              "0.0": -0.75,
              "12.5": -0.258,
              "25.0": 0.094,
              "37.5": 0.305,
              "50.0": 0.375,
              "62.5": 0.305,
              "75.0": 0.094,
              "87.5": -0.258,
              "100.0": -0.75
            }
          },
          "bending_moment_z": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "torsion": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          }
        },
        "member_stresses": {
          "axial_stress": {
            "1": {
              "0.0": 0,
              "12.5": 0,
              "25.0": 0,
              "37.5": 0,
              "50.0": 0,
              "62.5": 0,
              "75.0": 0,
              "87.5": 0,
              "100.0": 0
            }
          },
          "top_bending_stress_z": {
            "1": {}
          },
          "top_bending_stress_y": {
            "1": {}
          },
          "btm_bending_stress_z": {
            "1": {}
          },
          "btm_bending_stress_y": {
            "1": {}
          },
          "shear_stress_z": {
            "1": {}
          },
          "shear_stress_y": {
            "1": {}
          },
          "shear_stress_total": {
            "1": {}
          },
          "torsion_stress": {
            "1": {}
          },
          "max_combined_normal_stress": {
            "1": {}
          },
          "min_combined_normal_stress": {
            "1": {}
          }
        },
        "member_lengths": {
          "1": 3
        },
        "member_stations": {
          "1": [
            0,
            12.5,
            25,
            37.5,
            50,
            62.5,
            75,
            87.5,
            100
          ]
        },
        "member_discontinuities": {
          "1": 0
        },
        "member_minimums": {
          "displacement_x": {
            "1": 0
          },
          "displacement_y": {
            "1": 0
          },
          "displacement_z": {
            "1": -0.1265625
          },
          "displacement_sum": {
            "1": 0
          },
          "displacement_local_x": {
            "1": 0
          },
          "displacement_local_y": {
            "1": 0
          },
          "displacement_local_z": {
            "1": -0.1265625
          },
          "displacement_local_sum": {
            "1": 0
          },
          "displacement_relative": {
            "1": 0
          },
          "displacement_relative_local_x": {
            "1": 0
          },
          "displacement_relative_local_y": {
            "1": 0
          },
          "displacement_relative_local_z": {
            "1": -0.1265625
          },
          "displacement_relative_2": {
            "1": 0
          },
          "displacement_relative_local_x_2": {
            "1": 0
          },
          "displacement_relative_local_y_2": {
            "1": 0
          },
          "displacement_relative_local_z_2": {
            "1": -0.1265625
          },
          "displacement_span_ratio": {
            "1": 23703
          },
          "displacement_span_ratio_2": {
            "1": 23703
          },
          "rotation_x": {
            "1": 0
          },
          "rotation_y": {
            "1": -0.0001265625
          },
          "rotation_z": {
            "1": 0
          },
          "rotation_local_x": {
            "1": 0
          },
          "rotation_local_y": {
            "1": -0.0001265625
          },
          "rotation_local_z": {
            "1": 0
          },
          "axial_force": {
            "1": 0
          },
          "shear_force_y": {
            "1": 0
          },
          "shear_force_z": {
            "1": -1.5
          },
          "torsion": {
            "1": 0
          },
          "bending_moment_y": {
            "1": -0.75
          },
          "bending_moment_z": {
            "1": 0
          },
          "top_bending_stress_z": {
            "1": 0
          },
          "top_bending_stress_y": {
            "1": 0
          },
          "btm_bending_stress_z": {
            "1": 0
          },
          "btm_bending_stress_y": {
            "1": 0
          },
          "shear_stress_z": {
            "1": 0
          },
          "shear_stress_y": {
            "1": 0
          },
          "shear_stress_total": {
            "1": 0
          },
          "axial_stress": {
            "1": 0
          },
          "max_combined_normal_stress": {
            "1": 0
          },
          "min_combined_normal_stress": {
            "1": 0
          },
          "torsion_stress": {
            "1": 0
          }
        },
        "member_maximums": {
          "displacement_x": {
            "1": 0
          },
          "displacement_y": {
            "1": 0
          },
          "displacement_z": {
            "1": 0
          },
          "displacement_sum": {
            "1": 0.1265625
          },
          "displacement_local_x": {
            "1": 0
          },
          "displacement_local_y": {
            "1": 0
          },
          "displacement_local_z": {
            "1": 0
          },
          "displacement_local_sum": {
            "1": 0.1265625
          },
          "displacement_relative": {
            "1": 0.1265625
          },
          "displacement_relative_local_x": {
            "1": 0
          },
          "displacement_relative_local_y": {
            "1": 0
          },
          "displacement_relative_local_z": {
            "1": 0
          },
          "displacement_relative_2": {
            "1": 0.1265625
          },
          "displacement_relative_local_x_2": {
            "1": 0
          },
          "displacement_relative_local_y_2": {
            "1": 0
          },
          "displacement_relative_local_z_2": {
            "1": 0
          },
          "displacement_span_ratio": {
            "1": 1000000000000
          },
          "displacement_span_ratio_2": {
            "1": 23703
          },
          "rotation_x": {
            "1": 0
          },
          "rotation_y": {
            "1": 0.0001265625
          },
          "rotation_z": {
            "1": 0
          },
          "rotation_local_x": {
            "1": 0
          },
          "rotation_local_y": {
            "1": 0.0001265625
          },
          "rotation_local_z": {
            "1": 0
          },
          "axial_force": {
            "1": 0
          },
          "shear_force_y": {
            "1": 0
          },
          "shear_force_z": {
            "1": 1.5
          },
          "torsion": {
            "1": 0
          },
          "bending_moment_y": {
            "1": 0.375
          },
          "bending_moment_z": {
            "1": 0
          },
          "top_bending_stress_z": {
            "1": 0
          },
          "top_bending_stress_y": {
            "1": 0
          },
          "btm_bending_stress_z": {
            "1": 0
          },
          "btm_bending_stress_y": {
            "1": 0
          },
          "shear_stress_z": {
            "1": 0
          },
          "shear_stress_y": {
            "1": 0
          },
          "shear_stress_total": {
            "1": 0
          },
          "axial_stress": {
            "1": 0
          },
          "max_combined_normal_stress": {
            "1": 0
          },
          "min_combined_normal_stress": {
            "1": 0
          },
          "torsion_stress": {
            "1": 0
          }
        },
        "member_peak_results": {
          "displacement_x": {
            "min": 0,
            "max": 0
          },
          "displacement_y": {
            "min": 0,
            "max": 0
          },
          "displacement_z": {
            "min": -0.1265625,
            "max": 0
          },
          "displacement_sum": {
            "min": 0,
            "max": 0.1265625
          },
          "displacement_local_x": {
            "min": 0,
            "max": 0
          },
          "displacement_local_y": {
            "min": 0,
            "max": 0
          },
          "displacement_local_z": {
            "min": -0.1265625,
            "max": 0
          },
          "displacement_local_sum": {
            "min": 0,
            "max": 0.1265625
          },
          "displacement_relative": {
            "min": 0,
            "max": 0.1265625
          },
          "displacement_relative_local_x": {
            "min": 0,
            "max": 0
          },
          "displacement_relative_local_y": {
            "min": 0,
            "max": 0
          },
          "displacement_relative_local_z": {
            "min": -0.1265625,
            "max": 0
          },
          "displacement_relative_2": {
            "min": 0,
            "max": 0.1265625
          },
          "displacement_relative_local_x_2": {
            "min": 0,
            "max": 0
          },
          "displacement_relative_local_y_2": {
            "min": 0,
            "max": 0
          },
          "displacement_relative_local_z_2": {
            "min": -0.1265625,
            "max": 0
          },
          "displacement_span_ratio": {
            "min": 23703,
            "max": 1000000000000
          },
          "displacement_span_ratio_2": {
            "min": 23703,
            "max": 23703
          },
          "rotation_x": {
            "min": 0,
            "max": 0
          },
          "rotation_y": {
            "min": -0.0001265625,
            "max": 0.0001265625
          },
          "rotation_z": {
            "min": 0,
            "max": 0
          },
          "rotation_local_x": {
            "min": 0,
            "max": 0
          },
          "rotation_local_y": {
            "min": -0.0001265625,
            "max": 0.0001265625
          },
          "rotation_local_z": {
            "min": 0,
            "max": 0
          },
          "axial_force": {
            "min": 0,
            "max": 0
          },
          "shear_force_y": {
            "min": 0,
            "max": 0
          },
          "shear_force_z": {
            "min": -1.5,
            "max": 1.5
          },
          "torsion": {
            "min": 0,
            "max": 0
          },
          "bending_moment_y": {
            "min": -0.75,
            "max": 0.375
          },
          "bending_moment_z": {
            "min": 0,
            "max": 0
          },
          "top_bending_stress_z": {
            "min": 0,
            "max": 0
          },
          "top_bending_stress_y": {
            "min": 0,
            "max": 0
          },
          "btm_bending_stress_z": {
            "min": 0,
            "max": 0
          },
          "btm_bending_stress_y": {
            "min": 0,
            "max": 0
          },
          "shear_stress_z": {
            "min": 0,
            "max": 0
          },
          "shear_stress_y": {
            "min": 0,
            "max": 0
          },
          "shear_stress_total": {
            "min": 0,
            "max": 0
          },
          "axial_stress": {
            "min": 0,
            "max": 0
          },
          "max_combined_normal_stress": {
            "min": 0,
            "max": 0
          },
          "min_combined_normal_stress": {
            "min": 0,
            "max": 0
          },
          "torsion_stress": {
            "min": 0,
            "max": 0
          }
        },
        "plate_displacements": {
          "displacement_x": {},
          "displacement_y": {},
          "displacement_z": {},
          "displacement_sum": {}
        },
        "plate_forces": {
          "force_x": {},
          "force_xy": {},
          "force_xz": {},
          "force_y": {},
          "force_yz": {},
          "moment_x": {},
          "moment_xy": {},
          "moment_y": {}
        },
        "plate_stresses": {
          "stress_major_principal_top": {},
          "stress_max_shear_top": {},
          "stress_minor_principal_top": {},
          "stress_von_mises_top": {},
          "stress_xx_top": {},
          "stress_yy_top": {},
          "stress_xy_top": {},
          "stress_major_principal_btm": {},
          "stress_max_shear_btm": {},
          "stress_minor_principal_btm": {},
          "stress_von_mises_btm": {},
          "stress_xx_btm": {},
          "stress_yy_btm": {},
          "stress_xy_btm": {}
        },
        "plate_minimums": {},
        "plate_maximums": {},
        "plate_peak_results": {
          "displacement_x": {
            "min": 0,
            "max": 0
          },
          "displacement_y": {
            "min": 0,
            "max": 0
          },
          "displacement_z": {
            "min": 0,
            "max": 0
          },
          "displacement_sum": {
            "min": 0,
            "max": 0
          },
          "stress_xx_top": {
            "min": 0,
            "max": 0
          },
          "stress_xx_btm": {
            "min": 0,
            "max": 0
          },
          "stress_yy_top": {
            "min": 0,
            "max": 0
          },
          "stress_yy_btm": {
            "min": 0,
            "max": 0
          },
          "stress_xy_top": {
            "min": 0,
            "max": 0
          },
          "stress_xy_btm": {
            "min": 0,
            "max": 0
          },
          "stress_major_principal_top": {
            "min": 0,
            "max": 0
          },
          "stress_major_principal_btm": {
            "min": 0,
            "max": 0
          },
          "stress_minor_principal_top": {
            "min": 0,
            "max": 0
          },
          "stress_minor_principal_btm": {
            "min": 0,
            "max": 0
          },
          "stress_von_mises_top": {
            "min": 0,
            "max": 0
          },
          "stress_von_mises_btm": {
            "min": 0,
            "max": 0
          },
          "stress_max_shear_top": {
            "min": 0,
            "max": 0
          },
          "stress_max_shear_btm": {
            "min": 0,
            "max": 0
          },
          "force_x": {
            "min": 0,
            "max": 0
          },
          "force_y": {
            "min": 0,
            "max": 0
          },
          "force_xy": {
            "min": 0,
            "max": 0
          },
          "force_xz": {
            "min": 0,
            "max": 0
          },
          "force_yz": {
            "min": 0,
            "max": 0
          },
          "moment_x": {
            "min": 0,
            "max": 0
          },
          "moment_y": {
            "min": 0,
            "max": 0
          },
          "moment_xy": {
            "min": 0,
            "max": 0
          }
        },
        "buckling": "disabled",
        "notional_loads": null
      }
    },
    globals: {
      last_node_id_created: "",
      last_structural_node: "",
      last_structural_member: "",
      current_resizer: "",
      selected_handles: [],
      user_interaction_step: "none", // Can be "none", "wait", "done"
      structure_nodes_shift: 0,
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
