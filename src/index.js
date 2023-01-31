import React, { useCallback } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./flowNodes.css";
import library from "./flow-nodes/handler";
import { ChakraProvider } from "@chakra-ui/react";
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

const nodes_library = library.nodes;

window.getState = getState;

class Renderer extends React.Component {
  render() {
    return <div className="renderer-container"></div>;
  }
}

function VisualEditor(props) {
  const state = props.app_state;

  const [nodes, setNodes] = useNodesState(state.model.nodes);
  const [edges, setEdges] = useEdgesState(state.model.edges);

  const saveRfInstance = (rfInstance) => storeRfInstance(rfInstance);

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    if (changes.length > 0) {
      // Only run the updater when data changes
      if (changes[0]["type"] === "reset") updateStateFromFlow();
    }
  };
  const onEdgesChange = (changes) => {
    console.log("Changing edges...", changes);
    setEdges((eds) => applyEdgeChanges(changes, eds));
    updateStateFromFlow();
  };
  const onEdgeUpdate = (oldEdge, newConnection) => {
    console.log("Updating edges...");
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
    updateStateFromFlow();
  };
  const onConnect = useCallback((connection) => {
    console.log("Connecting...");
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
          <NavBar></NavBar>
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
