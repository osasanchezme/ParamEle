import React from "react";
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
import GlobalControls from "./components/settings";
import NavBar from "./components/navbar";

import state from "./state";
import CommandsBar from "./components/commands_bar";
const { setInitialState, setState, getState, storeRfInstance, updateStateFromFlow, setInitialGlobals } = state;
setInitialState();
setInitialGlobals();

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
      // Only run the updater when data changes or a new noe is added
      if (changes[0]["type"] === "reset" || changes[0]["type"] === "add") updateStateFromFlow();
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
  const onConnect = (connection) => {
    console.log("Connecting...");
    setEdges((eds) => addEdge(connection, eds));
    updateStateFromFlow();
  };
  let mini_map;
  if (state.settings.general.mini_map) {
    mini_map = <MiniMap />;
  }
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
        {mini_map}
        <Controls />
      </ReactFlow>
    </div>
  );
}
class ParamEle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...getState(), mouse_x: 0, mouse_y: 0, mode: "wait_action" };
    this.changeGeneralSettingValue = this.changeGeneralSettingValue.bind(this);
    window.ParamEle.changeGeneralSettingValue = this.changeGeneralSettingValue.bind(this);
    this.changeAppMode = this.changeAppMode.bind(this);
    window.ParamEle.changeAppMode = this.changeAppMode.bind(this);
    this.getMouseCoordinates = this.getMouseCoordinates.bind(this);
    this.activateNodeCreation = this.activateNodeCreation.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  changeGeneralSettingValue(key, value) {
    // TODO Check if there is a faster way! -- Update only one key
    let curr_state = getState();
    curr_state.settings.general[key] = value;
    setState(curr_state);
    this.setState(getState());
  }
  changeAppMode(mode) {
    this.setState({ mode });
  }
  getMouseCoordinates(event) {
    if (this.state.mode !== "add_node") this.setState({ mouse_x: event.clientX, mouse_y: event.clientY });
  }
  activateNodeCreation(event) {
    if (event.target.className === "react-flow__pane react-flow__container") {
      this.setState(
        {
          mode: "wait_action",
        },
        () => {
          this.setState({
            mode: "add_node",
            mouse_x: event.clientX,
            mouse_y: event.clientY,
          });
        }
      );
    }
  }
  handleKeyPress(event) {
    if (event.key === "Escape") this.setState({ mode: "wait_action" });
  }
  render() {
    let commands_bar;
    if (this.state.mode === "add_node") {
      commands_bar = <CommandsBar active={this.state.mode === "add_node"} x={this.state.mouse_x} y={this.state.mouse_y}></CommandsBar>;
    }
    return (
      <ChakraProvider>
        <div
          className="app-cont"
          tabIndex={0}
          onKeyDown={this.handleKeyPress}
          onMouseMove={this.getMouseCoordinates}
          onClick={this.activateNodeCreation}
        >
          <NavBar></NavBar>
          <GlobalControls onSettingChange={this.changeGeneralSettingValue} settings={this.state.settings.general}></GlobalControls>
          {commands_bar}
          <VisualEditor app_state={this.state}></VisualEditor>
          <Renderer></Renderer>
        </div>
      </ChakraProvider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);
