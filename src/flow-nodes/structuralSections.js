import utils from "../utils";
import GenericInOutNode from "./generics/genericInOut";

// Rectangular
const rectangular_target_ids = ["material_id-id-1", "base-value-1", "height-value-1"];
function Rectangle({ data }) {
  return <GenericInOutNode node_label={"Secc. Rectangular"} data={data} target_ids={rectangular_target_ids} source_ids={["section-out"]}></GenericInOutNode>;
}

function RectangleExec(args) {
  let full_args = rectangular_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "section-out": {
      ...structural_args,
      "info": {
        "shape": "rectangle",
        "dimensions": {
            "h": structural_args["height"],
            "b": structural_args["base"]
        }
      }
    },
  };
}

const StructuralSectionNodes = {
    RectangleNode: { Node: Rectangle, Exec: RectangleExec },
  };
  
  export default StructuralSectionNodes;