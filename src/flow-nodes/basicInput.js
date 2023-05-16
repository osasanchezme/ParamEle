import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";

const node_source_ids = [];
const node_target_ids = [];
const node_editable_ids = ["value-value"];

function InputNumber({ data, id }) {
  return (
    <GenericInOutNode
      node_label={utils.getDisplayCopy("nodes", "inputNumber")}
      data={data}
      id={id}
      key={id}
      target_ids={node_target_ids}
      source_ids={node_source_ids}
      editable_ids={node_editable_ids}
    ></GenericInOutNode>
  );
}

const InputNumberNode = { Node: InputNumber };

export default InputNumberNode;
