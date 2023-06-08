import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";
import getState from "../getState";
import structural_utils from "../structural_utils";
import state from "../state";

function localGetCopy(node_name) {
  return utils.getDisplayCopy("nodes", node_name);
}

// Nodal results

// Member results
const member_result_target_ids = ["members-ids"];
const member_result_editable_ids = [
  { id: "result-value", show_handle: false, input_type: "dropdown", data: ["moment", "shear", "axial"] },
  { id: "result_type-value", show_handle: false, input_type: "dropdown", data: ["mid-span", "max", "min", "average", "node_A", "node_B"] },
];
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

function MemberResultExec(args, data) {
  let full_args = member_result_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  let results = getState("results");
  let { members } = structural_args;
  let y = [];
  let x = [];
  let plotly_data = { x, y, xaxis_title: "", yaxis_title: "", title: utils.getDisplayCopy("notifications", "no_data_to_show") };
  let iterating_node_data = state.getGlobalVariable("iterating_node_data");
  if (Object.keys(results).length > 0) {
    let result_value = data["result-value"];
    let result_type = data["result_type-value"];
    members.forEach((member_id) => {
      y.push(structural_utils.getResult(results, result_value, result_type, member_id, 0));
    });
    if (Object.keys(iterating_node_data).length > 0) {
      x = iterating_node_data.variation_values;
    }
    let result_label = utils.getDisplayCopy("tags", result_value);
    let plot_title = `${result_label} @ ${utils.getDisplayCopy("tags", result_type)}`;
    plotly_data = { x, y, xaxis_title: iterating_node_data.node_label, yaxis_title: result_label, title: plot_title };
  }
  return {
    "plotable_out-plotly_data": plotly_data,
    input: {
      ...structural_args,
    },
  };
}

const StructuralResultsNodes = {
  MemberResultNode: { Node: MemberResult, Exec: MemberResultExec },
};

export default StructuralResultsNodes;
