import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";

function NodesWrapper({ data, id }) {
  return (
    <GenericInOutNode
      node_label={utils.getDisplayCopy("nodes", "nodesWrapper")}
      data={data}
      id={id}
      target_ids={data.target_ids}
      source_ids={data.source_ids}
    ></GenericInOutNode>
  );
}

function NodesWrapperExec(args) {
  // let full_args = node_target_ids;
  // let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "node_out-id": {
      ...args,
    },
  };
}

const NodesWrapperNode = {
  Node: NodesWrapper,
  Exec: NodesWrapperExec,
};

export default NodesWrapperNode;
