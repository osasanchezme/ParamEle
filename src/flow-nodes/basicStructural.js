import utils from "../utils";
import GenericInOutNode from "./generics/genericInOut";

function localGetCopy(node_name){
  return utils.getDisplayCopy("nodes", node_name);
}

// Node
const node_target_ids = ["x-value", "y-value", "z-value"];
function StructuralNode({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("structuralNode")}
      data={data}
      id={id}
      target_ids={node_target_ids}
      source_ids={["node_out-id"]}
    ></GenericInOutNode>
  );
}

function StructuralNodeExec(args) {
  let full_args = node_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "node_out-id": {
      ...structural_args
    },
  };
}

// Member
const member_target_ids = ["node_A-id", "node_B-id", "section_id-id-1"];
function StructuralMember({ data, id }) {
  return <GenericInOutNode node_label={localGetCopy("structuralMember")} data={data} id={id} target_ids={member_target_ids} source_ids={["member_out-id"]}></GenericInOutNode>;
}

function StructuralMemberExec(args) {
  let full_args = member_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "member_out-id": {
      ...structural_args,
      type: "normal_continuous",
      cable_length: null,
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

// Fixed support
function StructuralFixedSupport({ data, id }) {
  return <GenericInOutNode node_label={localGetCopy("structuralFixedSupport")} data={data} id={id} target_ids={["node-id"]} source_ids={["support_out-id"]}></GenericInOutNode>;
}

function StructuralFixedSupportExec(args) {
  let node = args["node-id"];
  return {
    "support_out-id": {
      direction_code: "BBBBBB",
      tx: 0,
      ty: 0,
      tz: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      type: "node",
      node,
      restraint_code: "FFFFFF",
    },
  };
}

// Pinned support
function StructuralPinSupport({ data, id }) {
  return <GenericInOutNode node_label={localGetCopy("structuralPinSupport")} data={data} id={id} target_ids={["node-id"]} source_ids={["support_out-id"]}></GenericInOutNode>;
}

function StructuralPinSupportExec(args) {
  let node = args["node-id"];
  return {
    "support_out-id": {
      direction_code: "BBBBBB",
      tx: 0,
      ty: 0,
      tz: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      type: "node",
      node,
      restraint_code: "FFFFFR",
    },
  };
}

// Point load
function StructuralPointLoad({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("structuralPointLoad")}
      data={data}
      id={id}
      target_ids={["node-id", "x_mag-value", "y_mag-value", "z_mag-value"]}
      source_ids={["point_load_out-id"]}
    ></GenericInOutNode>
  );
}

function StructuralPointLoadExec(args) {
  let node = args["node-id"];
  let x_mag = Number(args["x_mag-value"]);
  let y_mag = Number(args["y_mag-value"]);
  let z_mag = Number(args["z_mag-value"]);
  if (isNaN(x_mag)) x_mag = 0;
  if (isNaN(y_mag)) y_mag = 0;
  if (isNaN(z_mag)) z_mag = 0;
  return {
    "point_load_out-id": {
      x_mag,
      y_mag,
      z_mag,
      load_group: "LG",
      type: "N",
      node,
    },
  };
}

// Distributed load
const dl_target_ids = [
  "member-id",
  "x_mag_A-value",
  "y_mag_A-value",
  "z_mag_A-value",
  "x_mag_B-value",
  "y_mag_B-value",
  "z_mag_B-value",
  "position_A-value",
  "position_B-value-100",
  "load_group-name-LG",
];
function StructuralDistributedLoad({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("structuralDistributedLoad")}
      data={data}
      id={id}
      target_ids={dl_target_ids}
      source_ids={["distributed_load_out-id"]}
    ></GenericInOutNode>
  );
}

function StructuralDistributedLoadExec(args) {
  let full_args = dl_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "distributed_load_out-id": {
      ...structural_args,
      axes: "global",
    },
  };
}

// Plate
const plate_target_ids = ["nodes-ids", "thickness-value"];
function StructuralPlate({ data, id }) {
  return <GenericInOutNode node_label={localGetCopy("structuralPlate")} data={data} id={id} target_ids={plate_target_ids} source_ids={["plate_out-id"]}></GenericInOutNode>;
}

function StructuralPlateExec(args) {
  let full_args = plate_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "plate_out-id": {
      ...structural_args,
      material_id: 1,
      rotZ: 0,
      type: "auto",
      offset: 0,
      diaphragm: "no",
      membrane_thickness: structural_args["thickness"],
      shear_thickness: structural_args["thickness"],
      bending_thickness: structural_args["thickness"],
      state: "stress",
      isMeshed: true,
    },
  };
}

// Point moment
const moment_target_ids = ["node-id", "x_mag-value", "y_mag-value", "z_mag-value"];
function StructuralMoment({ data, id }) {
  return <GenericInOutNode node_label={localGetCopy("structuralMoment")} data={data} id={id} target_ids={moment_target_ids} source_ids={["moment_out-id"]}></GenericInOutNode>;
}

function StructuralMomentExec(args) {
  let full_args = moment_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "moment_out-id": {
      ...structural_args,
      type: "n",
      load_group: "DL",
    },
  };
}

// Material
const material_target_ids = ["name-name-Concrete", "density-value", "elasticity_modulus-value-20000", "poissons_ratio-value-0.3", "class-name-concrete"];
function StructuralMaterial({ data, id }) {
  return <GenericInOutNode node_label={localGetCopy("structuralMaterial")} data={data} id={id} target_ids={material_target_ids} source_ids={["material_out-id"]}></GenericInOutNode>;
}

function StructuralMaterialExec(args) {
  let full_args = material_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "material_out-id": {
      ...structural_args,
    },
  };
}

const BasicStructuralNodes = {
  StructuralNodeNode: { Node: StructuralNode, Exec: StructuralNodeExec },
  StructuralMemberNode: { Node: StructuralMember, Exec: StructuralMemberExec },
  StructuralFixedSupportNode: { Node: StructuralFixedSupport, Exec: StructuralFixedSupportExec },
  StructuralPinSupportNode: { Node: StructuralPinSupport, Exec: StructuralPinSupportExec },
  StructuralPointLoadNode: { Node: StructuralPointLoad, Exec: StructuralPointLoadExec },
  StructuralDistributedLoadNode: { Node: StructuralDistributedLoad, Exec: StructuralDistributedLoadExec },
  StructuralPlateNode: { Node: StructuralPlate, Exec: StructuralPlateExec },
  StructuralMomentNode: { Node: StructuralMoment, Exec: StructuralMomentExec },
  StructuralMaterialNode: { Node: StructuralMaterial, Exec: StructuralMaterialExec },
};

export default BasicStructuralNodes;
