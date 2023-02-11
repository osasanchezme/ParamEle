import GenericInOutNode from "./generics/genericInOut";

// Node
function StructuralNode({ data }) {
  return (
    <GenericInOutNode
      node_label={"Nodo"}
      data={data}
      target_ids={["num-x-cord", "num-y-cord", "num-z-cord"]}
      source_ids={["node-out"]}
    ></GenericInOutNode>
  );
}

function StructuralNodeExec(args) {
  let x = Number(args["num-x-cord"]);
  let y = Number(args["num-y-cord"]);
  let z = Number(args["num-z-cord"]);
  return {
    "node-out": {
      x,
      y,
      z,
    },
  };
}

// Member
function StructuralMember({ data }) {
  return <GenericInOutNode node_label={"Elemento"} data={data} target_ids={["node-A", "node-B"]} source_ids={["member-out"]}></GenericInOutNode>;
}

// WIP - Return the next ID in the node (crate a util and global object in the state to be the structural model)
function StructuralMemberExec(args) {
  let node_A = args["node-A"];
  let node_B = args["node-B"];
  return {
    "member-out": {
      type: "normal_continuous",
      cable_length: null,
      node_A,
      node_B,
      section_id: 1,
      rotation_angle: 0,
      fixity_A: "FFFFFF",
      fixity_B: "FFFFFF",
      offset_Ax: "0",
      offset_Ay: "0",
      offset_Az: "0",
      offset_Bx: "0",
      offset_By: "0",
      offset_Bz: "0",
      stiffness_A_Ry: 0,
      stiffness_A_Rz: 0,
      stiffness_B_Ry: 0,
      stiffness_B_Rz: 0,
    },
  };
}

const BasicStructuralNodes = {
  StructuralNodeNode: { Node: StructuralNode, Exec: StructuralNodeExec },
  StructuralMemberNode: { Node: StructuralMember, Exec: StructuralMemberExec },
};

export default BasicStructuralNodes;
