import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";

function NodesWrapper({ data, id }) {
  let {source_ids, target_ids} = getTargetAndSourceIds(data);
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
  let {source_ids, target_ids} = getTargetAndSourceIds(data);
  let structural_args = utils.convertNodeToStructuralArgs(args, target_ids);
  let output = {};
  source_ids.forEach(source_id => {
    output[source_id] = 0;
  });
  output.input = structural_args;
  return output;
}

function getTargetAndSourceIds(data){
  let target_ids = [];
  let source_ids = [];
  Object.entries(data).forEach(([key, val]) => {
    switch (key){
      case "custom_label":
      case "internal_logic":
      case "input":
        break;
      case "input_handles":
        val.forEach(in_key => {
          target_ids.push(`${in_key.label}_${in_key.handle}`);
        });
        break;
      default:
        source_ids.push(key);
        break;
    }
  });
  return {source_ids, target_ids};
}

const NodesWrapperNode = {
  Node: NodesWrapper,
  Exec: NodesWrapperExec,
};

export default NodesWrapperNode;
