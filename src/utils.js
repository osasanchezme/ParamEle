import getState from "./getState";

/**
 *
 * @param {String} test_string
 * @param {[String]} options_array
 */
function getClosestMatches(test_string, options_array) {
  let scores = [];
  options_array.forEach((option) => {
    scores.push({
      name: option,
      score: scoreCompareStrings(option, test_string),
    });
  });
  scores.sort(function (x, y) {
    return y.score - x.score;
  });
  return scores;
}

/**
 * Using longest common subsequence (LCS) algorithm and custom (self-made) start matching
 * @param {*} text1
 * @param {*} text2
 * @returns
 */
function scoreCompareStrings(text1, text2) {
  const result = new Array(text1.length + 1).fill(null).map(() => new Array(text2.length + 1).fill(null));
  function test(end1, end2) {
    if (end1 === -1 || end2 === -1) {
      return 0;
    }
    if (result[end1][end2] !== null) {
      return result[end1][end2];
    }
    if (text1[end1] === text2[end2]) {
      result[end1][end2] = 1 + test(end1 - 1, end2 - 1);
      return result[end1][end2];
    } else {
      result[end1][end2] = Math.max(test(end1 - 1, end2), test(end1, end2 - 1));
      return result[end1][end2];
    }
  }
  function checkStartMatches(text1, text2) {
    let limit = Math.min(text1.length, text2.length);
    let count = 0;
    let still_same = true;
    for (let i = 0; i < limit; i++){
      if (String(text1).toLowerCase()[count] === String(text2).toLowerCase()[count]){
        if (still_same) count++
      }else{
        still_same = false;
      }
    }
    return count;
  }
  return test(text1.length - 1, text2.length - 1) + checkStartMatches(text1, text2);
}

function nextNodeId() {
  let nodes = getState("model")["nodes"];
  let possible_id = 1;
  let node_ids = nodes.map((node) => {
    return node.id;
  });
  let found_id = false;
  while (!found_id) {
    node_ids.includes(`node-${possible_id}`) ? possible_id++ : (found_id = true);
  }
  return `node-${possible_id}`;
}

/**
 * 
 * @param {"nodes"|"members"} element_type 
 * @param {object} structure - Last structure in which to find the next available ID
 */
function nextStructuralId(element_type, structure){
  let element_keys = Object.keys(structure[element_type]);
  let next_possible_id = 1;
  let found_next = false;
  while(!found_next){
    if (element_keys.includes(String(next_possible_id))) next_possible_id += 1; else found_next = true;
  }
  return next_possible_id;
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

function changeAppMode(mode) {
  window.ParamEle.changeAppMode(mode);
}

const utils = { getClosestMatches, nextNodeId, changeAppMode, nextStructuralId, getEmptyStructuralModel };

export default utils;
