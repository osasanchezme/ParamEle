import { useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Input } from '@chakra-ui/react'

function TextUpdaterNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <div className="node-header">
        Texto
      </div>
      <div className="node-body">
        <Handle type="target" position={Position.Left} id="text-in" />
        <div>
          <Input placeholder='Ingresar texto' size='xs' onChange={onChange} autoComplete="off"/>
        </div>
        <Handle type="source" position={Position.Right} id="text-out" />
      </div>
    </div>
  );
}

export default TextUpdaterNode;
