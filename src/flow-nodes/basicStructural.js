import utils from "../utils";
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

// Fixed support
function StructuralFixedSupport({ data }) {
  return <GenericInOutNode node_label={"Apoyo empotrado"} data={data} target_ids={["node-A"]} source_ids={["support-out"]}></GenericInOutNode>;
}

function StructuralFixedSupportExec(args) {
  let node = args["node-A"];
  return {
    "support-out": {
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
function StructuralPinSupport({ data }) {
  return <GenericInOutNode node_label={"Apoyo articulado"} data={data} target_ids={["node-A"]} source_ids={["support-out"]}></GenericInOutNode>;
}

function StructuralPinSupportExec(args) {
  let node = args["node-A"];
  return {
    "support-out": {
      direction_code: "BBBBBB",
      tx: 0,
      ty: 0,
      tz: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      type: "node",
      node,
      restraint_code: "FFFRRR",
    },
  };
}

// Point load
function StructuralPointLoad({ data }) {
  return (
    <GenericInOutNode
      node_label={"Carga puntual"}
      data={data}
      target_ids={["node-A", "x_mag-value", "y_mag-value", "z_mag-value"]}
      source_ids={["point_load-out"]}
    ></GenericInOutNode>
  );
}

function StructuralPointLoadExec(args) {
  let node = args["node-A"];
  let x_mag = Number(args["x_mag-value"]);
  let y_mag = Number(args["y_mag-value"]);
  let z_mag = Number(args["z_mag-value"]);
  if (isNaN(x_mag)) x_mag = 0;
  if (isNaN(y_mag)) y_mag = 0;
  if (isNaN(z_mag)) z_mag = 0;
  return {
    "point_load-out": {
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
function StructuralDistributedLoad({ data }) {
  return (
    <GenericInOutNode
      node_label={"Carga distribuida"}
      data={data}
      target_ids={dl_target_ids}
      source_ids={["distributed_load-out"]}
    ></GenericInOutNode>
  );
}

function StructuralDistributedLoadExec(args) {
  let full_args = dl_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "distributed_load-out": {
      ...structural_args,
      axes: "global",
    },
  };
}

// Plate
const plate_target_ids = ["nodes-ids", "thickness-value"];
function StructuralPlate({ data }) {
  return <GenericInOutNode node_label={"Placa"} data={data} target_ids={plate_target_ids} source_ids={["plate-out"]}></GenericInOutNode>;
}

function StructuralPlateExec(args) {
  let full_args = plate_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "plate-out": {
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
function StructuralMoment({ data }) {
  return <GenericInOutNode node_label={"Momento"} data={data} target_ids={moment_target_ids} source_ids={["moment-out"]}></GenericInOutNode>;
}

function StructuralMomentExec(args) {
  let full_args = moment_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "moment-out": {
      ...structural_args,
      type: "n",
      load_group: "DL",
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
};

export default BasicStructuralNodes;
