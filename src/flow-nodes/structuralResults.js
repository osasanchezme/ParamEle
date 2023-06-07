import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";
import getState from "../getState";
import structural_utils from "../structural_utils";

function localGetCopy(node_name) {
  return utils.getDisplayCopy("nodes", node_name);
}

// Nodal results

// Member results
const member_result_target_ids = ["members-ids"];
const member_result_editable_ids = [{ id: "result-value", show_handle: false, input_type: "dropdown", data: ["moment", "shear", "axial"] }, { id: "result_type-value", show_handle: false, input_type: "dropdown", data: ["mid-span", "max", "min", "average", "node_A", "node_B"] }];
function MemberResult({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("structuralMemberResult")}
      data={data}
      id={id}
      target_ids={member_result_target_ids}
      editable_ids={member_result_editable_ids}
      source_ids={["plotable_out-plotly_data"]}
    ></GenericInOutNode>
  );
}

function MemberResultExec(args) {
  let full_args = member_result_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  let results = getState("results");
  return {
    "plotable_out-plotly_data": structural_utils.getResult(results, "moment", "mid-span", 1, 0),
    "input": {
      ...structural_args,
    }
  };
}

const StructuralResultsNodes = {
    MemberResultNode: { Node: MemberResult, Exec: MemberResultExec },
};

export default StructuralResultsNodes;
