import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";

function localGetCopy(node_name){
  return utils.getDisplayCopy("nodes", node_name);
}

// Sine
function MathSin({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathSinNode")} data={data} target_ids={["num-1-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathSinExec(args) {
  let num_1 = Number(args["num-1-in"]);
  return { "result_out": Math.sin(num_1) };
}

// Cosine
function MathCos({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathCosNode")} data={data} target_ids={["num-1-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathCosExec(args) {
  let num_1 = Number(args["num-1-in"]);
  return { "result_out": Math.cos(num_1) };
}

// Tangent
function MathTan({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathTanNode")} data={data} target_ids={["num-1-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathTanExec(args) {
  let num_1 = Number(args["num-1-in"]);
  return { "result_out": Math.tan(num_1) };
}

// Arc-sine
function MathAsin({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathAsinNode")} data={data} target_ids={["num-1-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathAsinExec(args) {
  let num_1 = Number(args["num-1-in"]);
  return { "result_out": Math.asin(num_1) };
}

// Arc-cosine
function MathAcos({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathAcosNode")} data={data} target_ids={["num-1-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathAcosExec(args) {
  let num_1 = Number(args["num-1-in"]);
  return { "result_out": Math.acos(num_1) };
}

// Arc-tan
function MathAtan({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathAtanNode")} data={data} target_ids={["num-1-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathAtanExec(args) {
  let num_1 = Number(args["num-1-in"]);
  return { "result_out": Math.atan(num_1) };
}

// Deg-to-rad
function MathDeg2Rad({ data }) {
  return <GenericInOutNode node_label={localGetCopy("MathDeg2RadNode")} data={data} target_ids={["num-1-in"]} source_ids={["result_out"]}></GenericInOutNode>;
}

function MathDeg2RadExec(args) {
  let num_1 = Number(args["num-1-in"]);
  return { "result_out": num_1 * Math.PI / 180 };
}

const TrigonometricNodes = {
  MathSinNode: { "Node": MathSin, "Exec": MathSinExec },
  MathCosNode: { "Node": MathCos, "Exec": MathCosExec },
  MathTanNode: { "Node": MathTan, "Exec": MathTanExec },
  MathAsinNode: { "Node": MathAsin, "Exec": MathAsinExec },
  MathAcosNode: { "Node": MathAcos, "Exec": MathAcosExec },
  MathAtanNode: { "Node": MathAtan, "Exec": MathAtanExec },
  MathDeg2RadNode: { "Node": MathDeg2Rad, "Exec": MathDeg2RadExec },
};

export default TrigonometricNodes;
