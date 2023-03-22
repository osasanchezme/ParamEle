import { Handle, Position } from "react-flow-renderer";
import { Input, HStack, Text, IconButton } from "@chakra-ui/react";
import { MdCheck, MdClose, MdEdit } from "react-icons/md";
import state from "../state";
import { useEffect, useRef, useState } from "react";
import utils from "../utils";
const { getRfInstance, updateStateFromFlow, getGlobalVariable, setGlobalVariable } = state;

function InputNumber({ data, id }) {
  const text_input = useRef(null);
  const [edit_visible, setEditVisible] = useState(false);
  const [is_editing, setIsEditing] = useState(false);
  const label_input_ref = useRef(null);
  useEffect(() => {
    if (id === getGlobalVariable("last_node_id_created")) text_input.current.focus();
  });
  const onChange = (evt) => {
    setGlobalVariable("last_node_id_created", "");
    // Update the component state (At React level)
    let rf_instance = getRfInstance();
    rf_instance.setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            value: evt.target.value,
          };
        }
        return node;
      })
    );
    updateStateFromFlow();
  };
  // Check if the user defined a custom_label for the node
  let node_label = utils.getDisplayCopy("nodes", "InputNumberNode");
  node_label = data.custom_label || node_label;
  // Edit label
  function handleMouseOver(e) {
    setEditVisible(true);
  }
  function handleMouseLeave(e) {
    setEditVisible(false);
  }
  function handleClickOnEdit(e) {
    setIsEditing(true);
  }
  function handleClickOnSave(e) {
    let custom_label = label_input_ref.current.value;
    state.updateNodeData(id, { custom_label });
    setIsEditing(false);
  }
  function handleClickOnCancel(e) {
    setIsEditing(false);
  }
  useEffect(() => {
    if (is_editing) label_input_ref.current.focus();
  });
  let edit_button =
    edit_visible && !is_editing ? (
      <IconButton className="node-label-edit-button" onClick={handleClickOnEdit} variant="ghost" aria-label="Edit Node Label" icon={<MdEdit />} />
    ) : (
      ""
    );
  let label_obj = <Text paddingTop="1px">{node_label}</Text>;
  let save_button = "";
  let cancel_button = "";
  if (is_editing) {
    label_obj = <Input ref={label_input_ref} className="editable-node-label" variant="unstyled" size="xs" defaultValue={node_label} placeholder={node_label} />;
    if (edit_visible) {
      save_button = (
        <IconButton className="node-label-edit-button" onClick={handleClickOnSave} variant="ghost" aria-label="Save Label" icon={<MdCheck />} />
      );
      cancel_button = (
        <IconButton className="node-label-edit-button" onClick={handleClickOnCancel} variant="ghost" aria-label="Discard Label" icon={<MdClose />} />
      );
    }
  }
  return (
    <div className="text-updater-node">
      <div className="node-header">
        <HStack onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
          {label_obj}
          {edit_button}
          {save_button}
          {cancel_button}
        </HStack>
      </div>
      <div className="node-body">
        <div>
          <Input
            ref={text_input}
            placeholder="Ingresar número"
            size="xs"
            onChange={onChange}
            value={data.value === undefined ? "" : data.value}
            autoComplete="off"
          />
        </div>
        <Handle type="source" position={Position.Right} id="value" />
      </div>
    </div>
  );
}

const InputNumberNode = {Node: InputNumber}

export default InputNumberNode;
