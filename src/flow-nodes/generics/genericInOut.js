import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { Tag, Tooltip } from "@chakra-ui/react";
import utils from "../../utils";
import EditableNodeHeader from "../../components/editable_node_header";
import state from "../../state";
/**
 *
 * @param {Object} props Properties object to create the node
 * @param {Object} props.data Calculated results for each of the output handles, using the same keys in the source_ids
 * @param {String} props.node_label Label to be displayed at the node's header
 * @param {string[]} props.target_ids IDs of the target (input) handles for the node
 * @param {string[]} props.source_ids IDs of the source (output) handles for the node
 * @returns {React.DOMElement} div element representing the ReactFlow node
 */
function GenericInOutNode({ data, id, node_label, target_ids, source_ids }) {
  // Check if the user defined a custom_label for the node
  node_label = data.custom_label || node_label;
  let source_copies = [];
  let target_copies = [];
  let top_pos = 15;
  let target_handles = target_ids.map((handle_id, handle_counter) => {
    let handle_data = utils.splitArgName(handle_id);
    let handle_style = { top: top_pos };
    top_pos += 20;
    return (
      <Handle
        type="target"
        style={handle_style}
        position={Position.Left}
        id={handle_id}
        key={handle_id}
        onClick={(event) => state.selectHandle(event, id, handle_id, node_label, handle_data.type)}
      />
    );
  });
  top_pos = 15;
  let source_handles = source_ids.map((handle_id, handle_counter) => {
    let handle_data = utils.splitArgName(handle_id);
    let handle_style = { top: top_pos };
    top_pos += 20;
    return (
      <Handle
        type="source"
        style={handle_style}
        position={Position.Right}
        id={handle_id}
        key={handle_id}
        onClick={(event) => state.selectHandle(event, id, handle_id, node_label, handle_data.type)}
      />
    );
  });
  top_pos = 8;
  let target_labels = target_ids.map((target_id, target_counter) => {
    let label_obj = utils.splitArgName(target_id);
    let target_label_style = { position: "absolute", minHeight: "var(--chakra-fontSizes-md)", borderRadius: "var(--chakra-radii-base)" };
    target_label_style["top"] = top_pos;
    top_pos += 20;
    let input_value = label_obj.default_value;
    if (data.input) input_value = data.input[label_obj.name];
    let display_copy = utils.getDisplayCopy("tags", label_obj.name);
    target_copies.push(display_copy);
    return (
      <Tooltip label={`${utils.getDisplayCopy("types", label_obj.type)} [${input_value}]`} key={target_id + "-tooltip"} placement={"right"}>
        <Tag size={"sm"} key={target_id + "-label"} style={target_label_style} variant={"target"}>
          {display_copy}
        </Tag>
      </Tooltip>
    );
  });
  top_pos = 8;
  let source_labels = source_ids.map((source_id, source_counter) => {
    let label_obj = utils.splitArgName(source_id, "source");
    let source_label_style = {
      position: "absolute",
      right: "var(--chakra-space-2)",
      minHeight: "var(--chakra-fontSizes-md)",
      borderRadius: "var(--chakra-radii-base)",
    };
    source_label_style["top"] = top_pos;
    top_pos += 20;
    let output_value = data[source_id];
    let display_copy = utils.getDisplayCopy("tags", label_obj.name);
    source_copies.push(display_copy);
    return (
      <Tooltip label={`${utils.getDisplayCopy("types", label_obj.type)} [${output_value}]`} key={source_id + "-tooltip"} placement={"right"}>
        <Tag size={"sm"} key={source_id + "-label"} style={source_label_style} variant={"source"}>
          {display_copy}
        </Tag>
      </Tooltip>
    );
  });
  // Get the longest string for defining width
  let max_copy_length = Math.max(source_copies.length, target_copies.length);
  let max_length = 0;
  for (let i = 0; i < max_copy_length; i++) {
    let source_length = source_copies[i] ? source_copies[i].length : 0;
    let target_length = target_copies[i] ? target_copies[i].length : 0;
    let sum_length = source_length + target_length;
    if (sum_length > max_length) max_length = sum_length;
  }
  let node_width = Math.max(max_length * 5 + 45, node_label.length * 8 + 20, 100);
  // Define the class name
  let class_name = "reactflow-node";
  if (data.selected) class_name += " selected";
  return (
    <div className={class_name} style={{ height: 20 * (Math.max(target_ids.length, source_ids.length) + 2), width: node_width }}>
      <EditableNodeHeader id={id} node_label={node_label}></EditableNodeHeader>
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
