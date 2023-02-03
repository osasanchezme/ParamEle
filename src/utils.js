import state from "./state";
const { getState, getRfInstance } = state;

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
 * @param {String} type Node type
 * @param {{x: Number, y: Number}} html_position Desired position for the node in the document space
 * @param {Object} [data] Initial data for the new node
 */
function addNodeToTheEditor(type, html_position, data = {}) {
  let rfInstance = getRfInstance();
  let position = rfInstance.project(html_position);
  let id = nextNodeId();
  rfInstance.addNodes([{ id, type, position, data }]);
}

function changeAppMode(mode) {
  window.ParamEle.changeAppMode(mode);
}

const utils = { getClosestMatches, nextNodeId, changeAppMode, addNodeToTheEditor };

export default utils;
