import ReactFlow, { MiniMap, Controls, addEdge, applyEdgeChanges, applyNodeChanges, updateEdge } from "react-flow-renderer";
import logic_runner from "../js/globalLogicRunner";
import { setGlobalVariable, storeRfInstance, updateStateFromFlow } from "../state";
import { useEffect } from "react";
import utils from "../utils";

let rf_instance;

function VisualEditor({ width, show_mini_map, nodes_library, is_model_locked, nodes, edges, setNodes, setEdges }) {
  // Whenever the model lock status changes the data on each node on that regard updates accordingly
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        node.data.model_locked = is_model_locked;
        return node;
      })
    );
    updateStateFromFlow();
  }, [is_model_locked]);

  const saveRfInstance = (rfInstance) => {
    rf_instance = rfInstance;
    storeRfInstance(rfInstance);
    logic_runner.run({ edges, nodes });
  };

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    if (changes.length > 0) {
      // Only run the updater when data changes or a new noe is added
      if (changes[0]["type"] === "reset" || changes[0]["type"] === "add") {
        updateStateFromFlow();
        console.log("Something changed... [Set the file state to unsaved]");
      }
    }
  };
  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    updateStateFromFlow();
  };
  const onEdgeUpdate = (oldEdge, newConnection) => {
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
    updateStateFromFlow();
  };
  const onConnect = (connection) => {
    setEdges((eds) => addEdge(connection, eds));
    updateStateFromFlow();
  };
  let mini_map;
  if (show_mini_map) {
    mini_map = <MiniMap />;
  }
  let global_style = {};
  global_style = { width: String(width) + "%", right: "0%" };
  return (
    <div className="editor-container" style={global_style}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onConnect={onConnect}
        nodeTypes={nodes_library}
        fitView
        onInit={saveRfInstance}
        selectionKeyCode={null}
        deleteKeyCode={null}
      >
        {mini_map}
        <Controls />
      </ReactFlow>
    </div>
  );
}

/**
 * Only place where I will directly modify data from the nodes from the rfInstance
 * @param {*} node_id
 * @param {*} data_key - Key under data to be modified
 * @param {*} data_value - Value to set in the key
 * @param {*} is_aux - Whether the key is under data.aux or under data directly
 */
function updateNodeDataKey(node_id, data_key, data_value, is_aux) {
  rf_instance.setNodes((nds) =>
    nds.map((node) => {
      if (node.id === node_id) {
        if (is_aux) {
          if (data_key == "selected_handles") {
            let id_index = node.data.aux[data_key].indexOf(data_value);
            if (id_index != -1) {
              node.data.aux[data_key].splice(id_index, 1);
            } else {
              node.data.aux[data_key].push(data_value);
            }
          } else {
            node.data.aux[data_key] = data_value;
          }
        } else {
          node.data[data_key] = data_value;
        }
      }
      return node;
    })
  );
}

/**
 *
 * @param {String} type Node type
 * @param {{x: Number, y: Number}} html_position Desired position for the node in the document space
 * @param {Object} [data] Initial data for the new node
 */
function addNodeToTheEditor(type, html_position, data = {}, is_rf_position = false, add_to_the_editor = true) {
  let position = html_position;
  if (!is_rf_position) {
    position = rf_instance.project(html_position);
  }
  let id = utils.nextNodeId();
  setGlobalVariable("last_node_id_created", id);
  data.aux = utils.getDefaultAuxData();
  if (add_to_the_editor) {
    rf_instance.addNodes([{ id, type, position, data }]);
  } else {
    return { id, type, position, data };
  }
}

export default VisualEditor;

export { updateNodeDataKey, addNodeToTheEditor };
