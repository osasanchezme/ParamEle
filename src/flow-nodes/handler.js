import InputNumberNode from "./basicInput";
import TrigonometricNodes from "./trigoMath";
import BasicMathNodes from "./basicMath";
import BasicStructuralNodes from "./basicStructural";
import StructuralSectionNodes from "./structuralSections";
import utils from "../utils";


function createNodesLibrary() {
  function localGetCopy(node_name){
    return utils.getDisplayCopy("nodes", node_name);
  }
  const global_library_wrapper = {
    inputNumber: { node_component: InputNumberNode, label: localGetCopy("InputNumberNode") },
    // Basic math
    sumNumbers: { node_component: BasicMathNodes.MathSumNode, label: localGetCopy("MathSumNode") },
    multiplyNumbers: { node_component: BasicMathNodes.MathMultiplyNode, label: localGetCopy("MathMultiplyNode") },
    divideNumbers: { node_component: BasicMathNodes.MathDivideNode, label: localGetCopy("MathDivideNode") },
    roundNumber: { node_component: BasicMathNodes.MathRoundNode, label: localGetCopy("MathRoundNode") },
    // Trigonometric math
    sin: { node_component: TrigonometricNodes.MathSinNode, label: localGetCopy("MathSinNode") },
    cos: { node_component: TrigonometricNodes.MathCosNode, label: localGetCopy("MathCosNode") },
    tan: { node_component: TrigonometricNodes.MathTanNode, label: localGetCopy("MathTanNode") },
    asin: { node_component: TrigonometricNodes.MathAsinNode, label: localGetCopy("MathAsinNode") },
    acos: { node_component: TrigonometricNodes.MathAcosNode, label: localGetCopy("MathAcosNode") },
    atan: { node_component: TrigonometricNodes.MathAtanNode, label: localGetCopy("MathAtanNode") },
    deg2rad: { node_component: TrigonometricNodes.MathDeg2RadNode, label: localGetCopy("MathDeg2RadNode") },
    // Basic structural
    structuralNode: { node_component: BasicStructuralNodes.StructuralNodeNode, label: localGetCopy("StructuralNodeNode") },
    structuralMember: { node_component: BasicStructuralNodes.StructuralMemberNode, label: localGetCopy("StructuralMemberNode") },
    structuralFixedSupport: { node_component: BasicStructuralNodes.StructuralFixedSupportNode, label: localGetCopy("StructuralFixedSupportNode") },
    structuralPinSupport: { node_component: BasicStructuralNodes.StructuralPinSupportNode, label: localGetCopy("StructuralPinSupportNode") },
    structuralPointLoad: { node_component: BasicStructuralNodes.StructuralPointLoadNode, label: localGetCopy("StructuralPointLoadNode") },
    structuralDistributedLoad: { node_component: BasicStructuralNodes.StructuralDistributedLoadNode, label: localGetCopy("StructuralDistributedLoadNode") },
    structuralPlate: { node_component: BasicStructuralNodes.StructuralPlateNode, label: localGetCopy("StructuralPlateNode") },
    structuralMoment: { node_component: BasicStructuralNodes.StructuralMomentNode, label: localGetCopy("StructuralMomentNode") },
    structuralMaterial: { node_component: BasicStructuralNodes.StructuralMaterialNode, label: localGetCopy("StructuralMaterialNode") },
    // Section shapes
    structuralRectangleSection: { node_component: StructuralSectionNodes.RectangleNode, label: localGetCopy("RectangleNode") },
  };

  let nodes = {};
  let execution = {};
  let mapping = {};

  Object.entries(global_library_wrapper).forEach(([key, value]) => {
    nodes[key] = value.node_component.Node;
    execution[key] = value.node_component.Exec;
    mapping[value.label] = key;
  });

  return { nodes, execution, mapping };
}

export default createNodesLibrary;
