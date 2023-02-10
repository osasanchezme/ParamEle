import GenericInOutNode from "./generics/genericInOut";

// Sum
function MathSum({ data }) {
  return <GenericInOutNode node_label={"Sumar"} data={data} target_ids={["num-1-in", "num-2-in"]} source_ids={["result-out"]}></GenericInOutNode>;
}

function MathSumExec(args) {
  let num_1 = Number(args["num-1-in"]);
  let num_2 = Number(args["num-2-in"]);
  return { "result-out": num_1 + num_2 };
}

// Multiply
function MathMultiply({ data }) {
  return <GenericInOutNode node_label={"Multiplicar"} data={data} target_ids={["num-1-in", "num-2-in"]} source_ids={["result-out"]}></GenericInOutNode>;
}

function MathMultiplyExec(args) {
  let num_1 = Number(args["num-1-in"]);
  let num_2 = Number(args["num-2-in"]);
  return { "result-out": num_1 * num_2 };
}

// Divide
function MathDivide({ data }) {
  return <GenericInOutNode node_label={"Dividir"} data={data} target_ids={["num-1-in", "num-2-in"]} source_ids={["result-out"]}></GenericInOutNode>;
}

function MathDivideExec(args) {
  let num_1 = Number(args["num-1-in"]);
  let num_2 = Number(args["num-2-in"]);
  return { "result-out": num_1 / num_2 };
}

// Round
function MathRound({ data }) {
  return <GenericInOutNode node_label={"Redondear"} data={data} target_ids={["num-1-in", "num-2-in"]} source_ids={["result-out"]}></GenericInOutNode>;
}

function MathRoundExec(args) {
  let num_1 = Number(args["num-1-in"]);
  let round_to = Number(args["num-2-in"]);
  if (isNaN(round_to)) round_to = 0;
  return { "result-out": Number(num_1.toFixed(round_to)) };
}

const BasicMathNodes = {
  MathSumNode: { Node: MathSum, Exec: MathSumExec },
  MathMultiplyNode: { Node: MathMultiply, Exec: MathMultiplyExec },
  MathDivideNode: { Node: MathDivide, Exec: MathDivideExec },
  MathRoundNode: { Node: MathRound, Exec: MathRoundExec },
};

export default BasicMathNodes;
