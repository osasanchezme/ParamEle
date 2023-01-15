import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./flowNodes.css";
import nodes_library from "./flow-nodes/handler";
import { ChakraProvider} from "@chakra-ui/react";
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
} from "react-flow-renderer";
import GlobalControls from "./settings";
import NavBar from "./components/navbar";

import state from "./state";
const {
  setInitialState,
  setState,
  getState,
  storeRfInstance,
  updateStateFromFlow,
  getRfInstance,
} = state;
setInitialState();

window.getState = getState;

class Renderer extends React.Component {
  render() {
    return <div className="renderer-container"></div>;
  }
}

function VisualEditor(props) {
  const state = props.app_state;

  const [nodes, setNodes] = useState(state.model.nodes);
  const [edges, setEdges] = useState(state.model.edges);

  const saveRfInstance = (rfInstance) => storeRfInstance(rfInstance);

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    updateStateFromFlow();
  };
  const onEdgesChange = (changes) => {
    setEdges((eds) => {
      applyEdgeChanges(changes, eds);
      console.log(getRfInstance().getEdges());
    });
    updateStateFromFlow();
  };
  const onEdgeUpdate = (oldEdge, newConnection) => {
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
    updateStateFromFlow();
  };
  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
    updateStateFromFlow();
  }, []);

  if (state.settings.general.mini_map) {
    return (
      <div className="editor-container">
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
      </div>
    );
  } else {
    return (
      <div className="editor-container">
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
          <Controls />
        </ReactFlow>
      </div>
    );
  }
}
class ParamEle extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();
    this.changeGeneralSettingValue = this.changeGeneralSettingValue.bind(this);
  }
  changeGeneralSettingValue(key, value) {
    // TODO Check if there is a faster way! -- Update only one key
    let curr_state = getState();
    curr_state.settings.general[key] = value;
    setState(curr_state);
    this.setState(getState());
  }
  render() {
    return (
      <ChakraProvider>
        <div className="app-cont">
          <NavBar
          ></NavBar>
          <GlobalControls
            onSettingChange={this.changeGeneralSettingValue}
            settings={this.state.settings.general}
          ></GlobalControls>
          <VisualEditor app_state={this.state}></VisualEditor>
          <Renderer></Renderer>
        </div>
      </ChakraProvider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);
