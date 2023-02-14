import React from "react";
import ReactDOM from "react-dom/client";
import Plot from "react-plotly.js";
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
import renderer from "./js/renderer";
import state from "./state";
import CommandsBar from "./components/commands_bar";
import getState from "./getState";
import logic_runner from "./js/globalLogicRunner";
const { setInitialState, setState, storeRfInstance, updateStateFromFlow } = state;

setInitialState();

window.ParamEle.updateStateFromFlow = updateStateFromFlow;

const nodes_library = library.nodes;
class Renderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: renderer.getData(),
      layout: renderer.getLayout(),
      frames: [],
      config: {},
    };
    this.updateRenderer = this.updateRenderer.bind(this);
    window.ParamEle.updateRenderer = this.updateRenderer.bind(this);
  }
  updateRenderer() {
    this.setState({ data: renderer.getData() });
  }
  render() {
    // if (this.props.visible) utils.changeAppMode("renderer"); // TODO - For some reason changing the app mode gets the plot updating forever
    return (
      <div className="renderer-container" style={{ zIndex: this.props.visible ? 4 : 3 }}>
        <Plot
          data={this.state.data}
          layout={this.state.layout}
          frames={this.state.frames}
          config={this.state.config}
          onInitialized={(figure) => this.setState(figure)}
          onUpdate={(figure) => this.setState(figure)}
          divId={"renderer-container"}
          // data={renderer.getData()}
          // data={this.state.data}
          // layout={{ height: 500 }}
          // config={{scrollZoom: true}}
          // onInitialized={(figure) => this.setState(figure)}
          // onUpdate={(figure) => this.setState(figure)}
        />
      </div>
    );
  }
}

function VisualEditor(props) {
  const state = props.app_state;

  const [nodes, setNodes] = useNodesState(state.model.nodes);
  const [edges, setEdges] = useEdgesState(state.model.edges);

  const saveRfInstance = (rfInstance) => {
    storeRfInstance(rfInstance);
    logic_runner.run();
  };

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    if (changes.length > 0) {
      // Only run the updater when data changes or a new noe is added
      if (changes[0]["type"] === "reset" || changes[0]["type"] === "add") updateStateFromFlow();
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
    let curr_settings = getState("settings");
    curr_settings.general[key] = value;
    setState(curr_settings, "settings");
    this.setState(getState());
  }
  changeAppMode(mode) {
    this.setState({ mode });
  }
  getMouseCoordinates(event) {
    // TODO This is killing the app, for it is updating the state of the top parent every time the mouse moves
    // if (this.state.mode === "wait_action") this.setState({ mouse_x: event.clientX, mouse_y: event.clientY });
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
          <Renderer visible={!this.state.settings.general.show_nodes}></Renderer>
        </div>
      </ChakraProvider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);
