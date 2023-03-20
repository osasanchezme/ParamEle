import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";

function localGetCopy(node_name){
  return utils.getDisplayCopy("nodes", node_name);
}

// Sum
function MathSum({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathSumNode")} data={data} target_ids={["num-1-in", "num-2-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathSumExec(args) {
  let num_1 = Number(args["num-1-in"]);
  let num_2 = Number(args["num-2-in"]);
  return { "result_out": num_1 + num_2 };
}

// Multiply
function MathMultiply({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathMultiplyNode")} data={data} target_ids={["num-1-in", "num-2-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathMultiplyExec(args) {
  let num_1 = Number(args["num-1-in"]);
  let num_2 = Number(args["num-2-in"]);
  return { "result_out": num_1 * num_2 };
}

// Divide
function MathDivide({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathDivideNode")} data={data} target_ids={["num-1-in", "num-2-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathDivideExec(args) {
  let num_1 = Number(args["num-1-in"]);
  let num_2 = Number(args["num-2-in"]);
  return { "result_out": num_1 / num_2 };
}

// Round
function MathRound({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathRoundNode")} data={data} target_ids={["num-1-in", "num-2-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathRoundExec(args) {
  let num_1 = Number(args["num-1-in"]);
  let round_to = Number(args["num-2-in"]);
  if (isNaN(round_to)) round_to = 0;
  return { "result_out": Number(num_1.toFixed(round_to)) };
}

const BasicMathNodes = {
  MathSumNode: { Node: MathSum, Exec: MathSumExec },
  MathMultiplyNode: { Node: MathMultiply, Exec: MathMultiplyExec },
  MathDivideNode: { Node: MathDivide, Exec: MathDivideExec },
  MathRoundNode: { Node: MathRound, Exec: MathRoundExec },
};

export default BasicMathNodes;
