import InputNumberNode from "./basicInput";
import TrigonometricNodes from "./trigoMath";
import BasicMathNodes from "./basicMath";
import BasicStructuralNodes from "./basicStructural";

const global_library_wrapper = {
  inputNumber: { node_component: InputNumberNode, label: "Número" },
  // Basic math
  sumNumbers: { node_component: BasicMathNodes.MathSumNode, label: "Suma de números" },
  multiplyNumbers: { node_component: BasicMathNodes.MathMultiplyNode, label: "Multiplicación de números" },
  divideNumbers: { node_component: BasicMathNodes.MathDivideNode, label: "División de números" },
  roundNumber: { node_component: BasicMathNodes.MathRoundNode, label: "Redondear número" },
  // Trigonometric math
  sin: { node_component: TrigonometricNodes.MathSinNode, label: "Seno" },
  cos: { node_component: TrigonometricNodes.MathCosNode, label: "Coseno" },
  tan: { node_component: TrigonometricNodes.MathTanNode, label: "Tangente" },
  asin: { node_component: TrigonometricNodes.MathAsinNode, label: "Arco-seno" },
  acos: { node_component: TrigonometricNodes.MathAcosNode, label: "Arco-coseno" },
  atan: { node_component: TrigonometricNodes.MathAtanNode, label: "Arco-tangente" },
  deg2rad: { node_component: TrigonometricNodes.MathDeg2RadNode, label: "Grados -> Rad" },
  // Basic structural
  structuralNode: { node_component: BasicStructuralNodes.StructuralNodeNode, label: "Nodo" },
  structuralMember: { node_component: BasicStructuralNodes.StructuralMemberNode, label: "Elemento" },
  structuralFixedSupport: { node_component: BasicStructuralNodes.StructuralFixedSupportNode, label: "Apoyo empotrado" },
  structuralPinSupport: { node_component: BasicStructuralNodes.StructuralPinSupportNode, label: "Apoyo articulado" },
  structuralPointLoad: { node_component: BasicStructuralNodes.StructuralPointLoadNode, label: "Carga puntual" },
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
