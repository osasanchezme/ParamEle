import { Handle, Position } from "react-flow-renderer";
import { Input } from "@chakra-ui/react";
import state from "../state";
const { getRfInstance, updateStateFromFlow } = state;

function TextUpdaterNode({ data, id }) {

  const onChange = (evt) => {
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
      <div className="node-header">Texto</div>
      <div className="node-body">
        <Handle type="target" position={Position.Left} id="text-in" />
        <div>
          <Input
            placeholder="Ingresar texto"
            size="xs"
            onChange={onChange}
            value={data.value}
            autoComplete="off"
          />
        </div>
        <Handle type="source" position={Position.Right} id="text-out" />
      </div>
    </div>
  );
}

export default TextUpdaterNode;
