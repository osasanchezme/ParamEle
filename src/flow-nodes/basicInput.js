import { Handle, Position } from "react-flow-renderer";
import { Input } from "@chakra-ui/react";
import state from "../state";
import { useEffect, useRef } from "react";
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

  return (
    <div className="text-updater-node">
      <div className="node-header">Número</div>
      <div className="node-body">
        <div>
          <Input
            ref={text_input}
            placeholder="Ingresar número"
            size="xs"
            onChange={onChange}
            value={data.value}
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
