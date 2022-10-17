import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./flowNodes.css";
import nodes_library from "./flow-nodes/handler";
import { ChakraProvider } from "@chakra-ui/react";
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge
} from "react-flow-renderer";

import state from "./state";
const {setInitialState, getState, storeRfInstance, updateStateFromFlow, getRfInstance} = state;
setInitialState();

window.getState = getState;

class NavBar extends React.Component {
  render() {
    return <div className="nav-bar"></div>;
  }
}
class Renderer extends React.Component {
  render() {
    return <div className="renderer-container"></div>;
  }
}

function Flow() {
  const state = getState();
  const [nodes, setNodes] = useState(state.model.nodes);
  const [edges, setEdges] = useState(state.model.edges);

  const saveRfInstance = rfInstance => storeRfInstance(rfInstance);
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      updateStateFromFlow();
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {applyEdgeChanges(changes, eds); console.log(getRfInstance().getEdges());});
      updateStateFromFlow();
    },
    [setEdges]
  );
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
      updateStateFromFlow();
    },
    []
  );
  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds))
      updateStateFromFlow();
    },
    []
  );

  return (
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
    >
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}

class VisualEditor extends React.Component {
  render() {
    return (
      <div className="editor-container">
        <Flow></Flow>
      </div>
    );
  }
}

class GlobalControls extends React.Component {
  render() {
    return (
      <div className="global-controls">
        <div className="global-controls-hidden"></div>
        <div className="global-controls-container"></div>
      </div>
    );
  }
}

class ParamEle extends React.Component {
  render() {
    return (
      <ChakraProvider>
        <div className="app-cont">
          <NavBar></NavBar>
          <GlobalControls></GlobalControls>
          <VisualEditor></VisualEditor>
          <Renderer></Renderer>
        </div>
      </ChakraProvider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);
