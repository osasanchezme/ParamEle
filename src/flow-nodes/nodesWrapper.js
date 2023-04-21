import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";
import logic_runner from "../js/globalLogicRunner";

function NodesWrapper({ data, id }) {
  let { source_ids, target_ids } = getTargetAndSourceIds(data);
  return (
    <GenericInOutNode
      node_label={utils.getDisplayCopy("nodes", "nodesWrapper")}
      data={data}
      id={id}
      target_ids={target_ids}
      source_ids={source_ids}
    ></GenericInOutNode>
  );
}

function NodesWrapperExec(args, data) {
  let { source_ids, target_ids, labels, data_keys, result_keys, result_labels, result_map } = getTargetAndSourceIds(data);
  let structural_args = utils.convertNodeToStructuralArgs(args, target_ids);
  let { internal_logic } = data;
  // Map the input values to the internal logic
  internal_logic.nodes.forEach((node) => {
    let {
      data: { custom_label },
    } = node;
    let map_index = labels.indexOf(custom_label);
    if (map_index !== -1) {
      node.data[data_keys[map_index]] = structural_args[custom_label];
    }
  });
  let processed_model = logic_runner.calculateModel(internal_logic);
  let output = {};
  // Map the results to the output handles
  processed_model.nodes.forEach((node) => {
    let {
      data: { custom_label },
    } = node;
    let map_index = result_labels.indexOf(custom_label);
    if (map_index !== -1) {
      output[result_map[map_index]] = node.data[result_keys[map_index]];
    }
  });
  output.input = structural_args;
  return output;
}

function getTargetAndSourceIds(data) {
  let target_ids = [];
  let source_ids = [];
  let labels = [];
  let data_keys = [];
  let result_labels = [];
  let result_keys = [];
  let result_map = [];
  Object.entries(data).forEach(([key, val]) => {
    switch (key) {
      case "custom_label":
      case "internal_logic":
      case "input":
        break;
      case "input_handles":
        val.forEach((in_key) => {
          target_ids.push(`${in_key.label}-${in_key.handle}`);
          labels.push(in_key.label);
          data_keys.push(in_key.data_key);
        });
        break;
      case "output_handles":
        val.forEach((in_key) => {
          result_labels.push(in_key.label);
          result_keys.push(in_key.key);
          result_map.push(in_key.result_key);
        });
        break;
      default:
        source_ids.push(key);
        break;
    }
  });
  return { source_ids, target_ids, labels, data_keys, result_labels, result_keys, result_map };
}

const NodesWrapperNode = {
  Node: NodesWrapper,
  Exec: NodesWrapperExec,
};

export default NodesWrapperNode;
