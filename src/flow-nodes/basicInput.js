import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";

const input_source_ids = [];
const input_target_ids = [];
const input_editable_ids = [{ id: "value-value", show_handle: true, input_type: "number" }];
function InputNumber({ data, id }) {
  return (
    <GenericInOutNode
      node_label={utils.getDisplayCopy("nodes", "inputNumber")}
      data={data}
      id={id}
      key={id}
      target_ids={input_target_ids}
      source_ids={input_source_ids}
      editable_ids={input_editable_ids}
    ></GenericInOutNode>
  );
}

const range_source_ids = [];
const range_target_ids = [];
const range_editable_ids = [
  { id: "start-value", show_handle: false, input_type: "number" },
  { id: "end-value", show_handle: false, input_type: "number" },
  { id: "step-value", show_handle: false, input_type: "number" },
  { id: "slider-value", show_handle: true, input_type: "slider" },
];
function VariableRange({ data, id }) {
  return (
    <GenericInOutNode
      node_label={utils.getDisplayCopy("nodes", "variableRange")}
      data={data}
      id={id}
      key={id}
      target_ids={range_target_ids}
      source_ids={range_source_ids}
      editable_ids={range_editable_ids}
    ></GenericInOutNode>
  );
}

const BasicInputNodes = { InputNumberNode: { Node: InputNumber }, VariableRangeNode: { Node: VariableRange } };

export default BasicInputNodes;
