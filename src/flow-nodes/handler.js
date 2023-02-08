import InputNumberNode from "./basicInput";
import SumNumbersNode from "./sumNumbers";
import MultiplyNumbersNode from "./multiplyNumbers";
import DivideNumbersNode from "./divideNumbers";
import TrigonometricNodes from "./trigoMath";

const global_library_wrapper = {
  inputNumber: { node_component: InputNumberNode, label: "Número" },
  sumNumbers: { node_component: SumNumbersNode, label: "Suma de números" },
  multiplyNumbers: { node_component: MultiplyNumbersNode, label: "Multiplicación de números" },
  divideNumbers: { node_component: DivideNumbersNode, label: "División de números" },
  // Trigonometric math
  sin: { node_component: TrigonometricNodes.MathSinNode, label: "Seno" },
  cos: { node_component: TrigonometricNodes.MathCosNode, label: "Coseno" },
  tan: { node_component: TrigonometricNodes.MathTanNode, label: "Tangente" },
  asin: { node_component: TrigonometricNodes.MathAsinNode, label: "Arco-seno" },
  acos: { node_component: TrigonometricNodes.MathAcosNode, label: "Arco-coseno" },
  atan: { node_component: TrigonometricNodes.MathAtanNode, label: "Arco-tangente" },
  deg2rad: { node_component: TrigonometricNodes.MathDeg2RadNode, label: "Grados -> Rad" },
};

let nodes = {};
let execution = {};
let mapping = {};

Object.entries(global_library_wrapper).forEach(([key, value]) => {
    nodes[key] = value.node_component.Node;
    execution[key] = value.node_component.Exec;
    mapping[value.label] = key;
});

const library = { nodes, execution, mapping };

export default library;
