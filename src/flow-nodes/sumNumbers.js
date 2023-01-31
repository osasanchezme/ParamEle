import { Handle, Position } from "react-flow-renderer";

function SumNumbers({ data, id }) {
  return (
    <div className="text-updater-node">
      <div className="node-header">Sumar</div>
      <div className="node-body">
        <Handle
          type="target"
          position={Position.Left}
          style={{ top: 5 }}
          id="num-1-in"
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ top: 15 }}
          id="num-2-in"
        />
        <div>
          <p>
            {JSON.stringify(data.value)}
          </p>
        </div>
        <Handle type="source" position={Position.Right} id="text-out" />
      </div>
    </div>
  );
}

function Exec(args){
  let num_1 = Number(args["num-1-in"]);
  let num_2 = Number(args["num-2-in"]);
  return {value: num_1 + num_2};
}

const SumNumbersNode = {SumNumbers, Exec}

export default SumNumbersNode;
