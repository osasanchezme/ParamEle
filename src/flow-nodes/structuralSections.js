import utils from "../utils";
import GenericInOutNode from "./generics/genericInOut";

function localGetCopy(node_name) {
  return utils.getDisplayCopy("nodes", node_name);
}

// Rectangular
const rectangular_target_ids = ["material_id-id-1", "base-value-1", "height-value-1"];
function Rectangle({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("structuralRectangleSection")}
      data={data}
      id={id}
      target_ids={rectangular_target_ids}
      source_ids={["section_out-id"]}
    ></GenericInOutNode>
  );
}

function RectangleExec(args) {
  let full_args = rectangular_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "section_out-id": {
      ...structural_args,
      info: {
        shape: "rectangle",
        dimensions: {
          h: structural_args["height"],
          b: structural_args["base"],
        },
      },
    },
  };
}

// Rectangular
const generic_target_ids = ["area-value-1", "Iz-value-1", "Iy-value-1", "J-value-1", "material_id-id-1"];
function Generic({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("structuralGenericSection")}
      data={data}
      id={id}
      target_ids={generic_target_ids}
      source_ids={["section_out-id"]}
    ></GenericInOutNode>
  );
}

function GenericExec(args) {
  let full_args = generic_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "section_out-id": {
      ...structural_args,
    },
  };
}

const StructuralSectionNodes = {
  RectangleNode: { Node: Rectangle, Exec: RectangleExec },
  GenericNode: { Node: Generic, Exec: GenericExec },
};

export default StructuralSectionNodes;
