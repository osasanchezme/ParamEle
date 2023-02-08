import React from "react";
import { Handle, Position } from "react-flow-renderer";
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
  let target_handles = target_ids.map((handle_id, handle_counter) => {
    let handle_style = {};
    if (target_ids.length > 1) handle_style = {top: 20 * (handle_counter + 1)};
    return <Handle type="target" style={handle_style} position={Position.Left} id={handle_id} />;
  });
  let source_handles = source_ids.map((handle_id, handle_counter) => {
    let handle_style = {};
    if (target_ids.length > 1) handle_style = {top: 20 * (handle_counter + 1)};
    return <Handle type="source" style={handle_style} position={Position.Right} id={handle_id} />;
  });
  return (
    <div className="text-updater-node" style={{height: 20 * (target_ids.length + 2)}}>
      <div className="node-header">{node_label}</div>
      <div className="node-body">
        {target_handles}
        <div>
          <p>{JSON.stringify(data[source_ids[0]])}</p>
        </div>
        {source_handles}
      </div>
    </div>
  );
}

export default GenericInOutNode;
