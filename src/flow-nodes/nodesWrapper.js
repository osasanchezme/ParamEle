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
  let { source_ids, target_ids, node_ids_to_map, data_keys, node_ids_to_map_from, result_data_keys } = getTargetAndSourceIds(data);
  let structural_args = utils.convertNodeToStructuralArgs(args, target_ids);
  let { internal_logic } = data;
  // Map the input values to the internal logic
  internal_logic.nodes.forEach((node) => {
    let { id } = node;
    let map_index = node_ids_to_map.indexOf(id);
    if (map_index !== -1) {
      let argument = utils.splitArgName(target_ids[map_index]);
      node.data[data_keys[map_index]] = structural_args[argument.name];
    }
  });
  let processed_model = logic_runner.calculateModel(internal_logic);
  let output = {};
  // Map the results to the output handles
  processed_model.nodes.forEach((node) => {
    let { id } = node;
    let map_index = node_ids_to_map_from.indexOf(id);
    if (map_index !== -1) {
      output[source_ids[map_index]] = node.data[result_data_keys[map_index]];
    }
  });
  output.input = structural_args;
  return output;
}

function getTargetAndSourceIds(data) {
  let target_ids = [];
  let source_ids = [];
  let node_ids_to_map = [];
  let node_ids_to_map_from = [];
  let data_keys = [];
  let result_data_keys = [];
  Object.entries(data).forEach(([key, val]) => {
    switch (key) {
      case "custom_label":
      case "internal_logic":
      case "input":
        break;
      case "input_handles":
        val.forEach((in_key) => {
          target_ids.push(`${in_key.label}-${in_key.type}`);
          node_ids_to_map.push(in_key.node_id_to_map);
          data_keys.push(in_key.data_key_to_map);
        });
        break;
      case "output_handles":
        val.forEach((in_key) => {
          source_ids.push(`${in_key.label}-${in_key.type}`);
          node_ids_to_map_from.push(in_key.node_id_to_map);
          result_data_keys.push(in_key.data_key_to_map);
        });
        break;
      default:
        break;
    }
  });
  return { source_ids, target_ids, node_ids_to_map, data_keys, node_ids_to_map_from, result_data_keys };
}

const NodesWrapperNode = {
  Node: NodesWrapper,
  Exec: NodesWrapperExec,
};

export default NodesWrapperNode;
