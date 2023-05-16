import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { Tag, Tooltip, Input } from "@chakra-ui/react";
import utils from "../../utils";
import EditableNodeHeader from "../../components/editable_node_header";
import state from "../../state";
import { useEffect, useRef } from "react";
/**
 *
 * @param {Object} props Properties object to create the node
 * @param {Object} props.data Calculated results for each of the output handles, using the same keys in the source_ids
 * @param {String} props.node_label Label to be displayed at the node's header
 * @param {string[]} props.target_ids IDs of the target (input) handles for the node
 * @param {string[]} props.editable_ids IDs of the input fields that can be edited by the user
 * @param {string[]} props.source_ids IDs of the source (output) handles for the node
 * @returns {React.DOMElement} div element representing the ReactFlow node
 */
function GenericInOutNode({ data, id, node_label, target_ids = [], source_ids = [], editable_ids = [] }) {
  const first_text_input = useRef(null);
  useEffect(() => {
    if (id === state.getGlobalVariable("last_node_id_created") && first_text_input.current) first_text_input.current.focus();
  });
  // Check if the user defined a custom_label for the node
  node_label = data.custom_label || node_label;
  let source_copies = [];
  let target_copies = [];
  // Create the target handles
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
  // Create the source handles
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
  // Create the target labels (tags + tooltips)
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
  // Create the source labels (tags + tooltips)
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
  // Create the editable handles
  top_pos = 20; // TODO - Review this (place well the editable fields below the other handles)
  let editable_handles = editable_ids.map((editable_id, editable_counter) => {
    let handle_data = utils.splitArgName(editable_id);
    let handle_style = { top: top_pos };
    top_pos += 20;
    return (
      <Handle
        type="source"
        style={handle_style}
        position={Position.Right}
        id={editable_id}
        key={editable_id}
        onClick={(event) => state.selectHandle(event, id, editable_id, node_label, handle_data.type)}
      />
    );
  });
  // Create the editable fields
  const onChange = (evt, data_key) => {
    state.setGlobalVariable("last_node_id_created", "");
    // Update the component state (At React level)
    let rf_instance = state.getRfInstance();
    rf_instance.setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data[data_key] = evt.target.value;
        }
        return node;
      })
    );
    state.updateStateFromFlow();
  };
  top_pos = 8;
  let editable_fields = editable_ids.map((editable_id, editable_counter) => {
    let editable_data = utils.splitArgName(editable_id);
    let data_key = `${editable_data.name}-${editable_data.type}`;
    return (
      <Input
        ref={editable_counter === 0 ? first_text_input : null}
        placeholder=""
        size="xs"
        key={editable_data.name + "-input"}
        onChange={(event) => onChange(event, data_key)}
        value={data[data_key] === undefined ? "" : data[data_key]}
        autoComplete="off"
      />
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
    <div
      className={class_name}
      style={{ height: 20 * (Math.max(target_ids.length, source_ids.length) + 2) + 30 * editable_ids.length, width: node_width }}
    >
      <EditableNodeHeader id={id} node_label={node_label}></EditableNodeHeader>
      <div className="node-body">
        {target_handles}
        <div>
          {target_labels}
          {source_labels}
          {editable_fields}
        </div>
        {source_handles}
        {editable_handles}
      </div>
    </div>
  );
}

export default GenericInOutNode;
