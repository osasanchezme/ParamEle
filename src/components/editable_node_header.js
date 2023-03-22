import React, { useState, useRef, useEffect } from "react";
import { HStack, Text, IconButton, Input } from "@chakra-ui/react";
import { MdCheck, MdClose, MdEdit } from "react-icons/md";
import state from "../state";

function EditableNodeHeader({ node_label, id }) {
  const [edit_visible, setEditVisible] = useState(false);
  const [is_editing, setIsEditing] = useState(false);
  const label_input_ref = useRef(null);
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
    label_obj = (
      <Input ref={label_input_ref} className="editable-node-label" variant="unstyled" size="xs" defaultValue={node_label} placeholder={node_label} />
    );
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
    <div className="node-header">
      <HStack onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
        {label_obj}
        {edit_button}
        {save_button}
        {cancel_button}
      </HStack>
    </div>
  );
}

export default EditableNodeHeader;
