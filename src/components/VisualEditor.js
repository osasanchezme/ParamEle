import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import logic_runner from "../js/globalLogicRunner";
import { storeRfInstance, updateStateFromFlow } from "../state";
import { useEffect } from "react";

function VisualEditor({ width, model, show_mini_map, nodes_library, is_model_locked }) {
  const [nodes, setNodes] = useNodesState(model.nodes);
  const [edges, setEdges] = useEdgesState(model.edges);

  // Whenever the model lock status changes the data on each node on that regard updates accordingly
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        node.data.model_locked = is_model_locked;
        return node;
      })
    );
    updateStateFromFlow();
  }, [is_model_locked, setNodes]);

  const saveRfInstance = (rfInstance) => {
    storeRfInstance(rfInstance);
    logic_runner.run();
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

export default VisualEditor;
