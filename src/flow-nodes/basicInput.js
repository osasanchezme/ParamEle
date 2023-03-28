import { Handle, Position } from "react-flow-renderer";
import { Input } from "@chakra-ui/react";
import state from "../state";
import { useEffect, useRef } from "react";
import utils from "../utils";
import EditableNodeHeader from "../components/editable_node_header";
const { getRfInstance, updateStateFromFlow, getGlobalVariable, setGlobalVariable } = state;

function InputNumber({ data, id }) {
  const text_input = useRef(null);
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
  let node_label = utils.getDisplayCopy("nodes", "inputNumber");
  node_label = data.custom_label || node_label;
  return (
    <div className="text-updater-node">
      <EditableNodeHeader id={id} node_label={node_label}></EditableNodeHeader>
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

const InputNumberNode = { Node: InputNumber };

export default InputNumberNode;
