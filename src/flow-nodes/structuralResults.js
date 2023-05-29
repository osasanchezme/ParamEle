import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";

function localGetCopy(node_name) {
  return utils.getDisplayCopy("nodes", node_name);
}

// Nodal results

// Member results
const member_result_target_ids = ["member-ids"];
const member_result_editable_ids = [{ id: "result-value", show_handle: true, input_type: "dropdown", data: ["moment", "shear", "axial"] }, { id: "resulta-value", show_handle: true, input_type: "dropdown", data: ["moment", "shear", "axial"] }];
function MemberResult({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("structuralMemberResult")}
      data={data}
      id={id}
      target_ids={member_result_target_ids}
      editable_ids={member_result_editable_ids}
      source_ids={[]}
    ></GenericInOutNode>
  );
}

function MemberResultExec(args) {
  let full_args = member_result_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "results_out-id": {...structural_args},
  };
}

const StructuralResultsNodes = {
    MemberResultNode: { Node: MemberResult, Exec: MemberResultExec },
};

export default StructuralResultsNodes;
