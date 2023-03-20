import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { chakra, Tag, Tooltip } from "@chakra-ui/react";
import utils from "../../utils";
/**
 *
 * @param {Object} props Properties object to create the node
 * @param {Object} props.data Calculated results for each of the output handles, using the same keys in the source_ids
 * @param {String} props.node_label Label to be displayed at the node's header
 * @param {string[]} props.target_ids IDs of the target (input) handles for the node
 * @param {string[]} props.source_ids IDs of the source (output) handles for the node
 * @returns {React.DOMElement} div element representing the ReactFlow node
 */
function GenericInOutNode({ data, node_label, target_ids, source_ids }) {
  let top_pos = 15;
  let target_handles = target_ids.map((handle_id, handle_counter) => {
    let handle_style = { top: top_pos };
    top_pos += 20;
    return <Handle type="target" style={handle_style} position={Position.Left} id={handle_id} key={handle_id} />;
  });
  top_pos = 15;
  let source_handles = source_ids.map((handle_id, handle_counter) => {
    let handle_style = { top: top_pos };
    top_pos += 20;
    return <Handle type="source" style={handle_style} position={Position.Right} id={handle_id} key={handle_id} />;
  });
  top_pos = 8;
  let target_labels = target_ids.map((target_id, target_counter) => {
    let label_obj = utils.splitArgName(target_id);
    let target_label_style = { position: "absolute", minHeight: "var(--chakra-fontSizes-md)", borderRadius: "var(--chakra-radii-base)" };
    target_label_style["top"] = top_pos;
    top_pos += 20;
    let input_value = label_obj.default_value;
    if (data.input) input_value = data.input[label_obj.name];
    return (
      <Tooltip label={`${utils.getDisplayCopy("types", label_obj.type)} [${input_value}]`} key={target_id + "-tooltip"} placement={"right"}>
        <Tag
          size={"sm"}
          color={"gray.600"}
          backgroundColor={"gray.100"}
          px={1}
          py={0}
          fontSize={8}
          key={target_id + "-label"}
          style={target_label_style}
        >
          {utils.getDisplayCopy("tags", label_obj.name)}
        </Tag>
      </Tooltip>
    );
  });
  top_pos = 8;
  let source_labels = source_ids.map((source_id, source_counter) => {
    let label_obj = utils.splitArgName(source_id);
    let source_label_style = {
      position: "absolute",
      right: "var(--chakra-space-2)",
      minHeight: "var(--chakra-fontSizes-md)",
      borderRadius: "var(--chakra-radii-base)",
    };
    source_label_style["top"] = top_pos;
    top_pos += 20;
    let output_value = data[source_id];
    label_obj.name = label_obj.name.replace("_out", "");
    return (
      <Tooltip label={`${utils.getDisplayCopy("types", label_obj.type)} [${output_value}]`} key={source_id + "-tooltip"} placement={"right"}>
        <Tag
          size={"sm"}
          color={"gray.600"}
          backgroundColor={"gray.300"}
          px={1}
          py={0}
          fontSize={8}
          key={source_id + "-label"}
          style={source_label_style}
        >
          {utils.getDisplayCopy("tags", label_obj.name)}
        </Tag>
      </Tooltip>
    );
  });
  return (
    <div className="text-updater-node" style={{ height: 20 * (target_ids.length + 2) }}>
      <div className="node-header">{node_label}</div>
      <div className="node-body">
        {target_handles}
        <div>
          {target_labels}
          {source_labels}
        </div>
        {source_handles}
      </div>
    </div>
  );
}

export default GenericInOutNode;
