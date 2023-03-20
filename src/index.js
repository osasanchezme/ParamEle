import React from "react";
import ReactDOM from "react-dom/client";
import Plot from "react-plotly.js";
import "./index.css";
import "./flowNodes.css";
import createNodesLibrary from "./flow-nodes/handler";
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
import ResizeBorder from "./components/resize_border";
const { setInitialState, setState, storeRfInstance, updateStateFromFlow } = state;

setInitialState();
const library = createNodesLibrary();
const nodes_library = library.nodes;
window.ParamEle.updateStateFromFlow = updateStateFromFlow;
window.ParamEle.nodesLibrary = library;
class Renderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: renderer.getData(),
      layout: renderer.getLayout(),
      frames: [],
      config: renderer.getConfig(),
    };
    this.updateRenderer = this.updateRenderer.bind(this);
    window.ParamEle.updateRenderer = this.updateRenderer.bind(this);
  }
  updateRenderer() {
    this.setState({ data: renderer.getData() });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.settings.side_by_side !== this.props.settings.side_by_side || prevProps.width !== this.props.width) {
      this.updateRenderer();
    }
  }
  render() {
    // if (this.props.visible) utils.changeAppMode("renderer"); // TODO - For some reason changing the app mode gets the plot updating forever
    let width_value = this.props.settings.side_by_side ? String(this.props.width) + "%" : "100%";
    return (
      <div className={"renderer-container"} style={{ zIndex: this.props.visible ? 4 : 3, width: width_value }}>
        <Plot
          data={this.state.data}
          layout={this.state.layout}
          frames={this.state.frames}
          config={this.state.config}
          onInitialized={(figure) => this.setState(figure)}
          onUpdate={(figure) => this.setState(figure)}
          divId={"renderer-container"}
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
  let global_style = {};
  if (state.settings.general.side_by_side) {
    global_style = { width: String(props.width) + "%", right: "0%" };
  }
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
    this.state = { ...getState(), mouse_x: 0, mouse_y: 0, mode: "wait_action", rel_orig_x: 0, rel_orig_y: 0 };
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
    if (this.state.mode === "resizing_modules") {
      event.preventDefault();
      let relative_location = (event.clientX / window.innerWidth) * 100;
      this.setState({ settings: { ...this.state.settings, layout: { renderer_width: relative_location, editor_width: 100 - relative_location } } });
    }
  }
  activateNodeCreation(event) {
    if (event.target.className === "react-flow__pane react-flow__container") {
      let bounding_rect = event.target.getBoundingClientRect();
      this.setState(
        {
          mode: "wait_action",
        },
        () => {
          this.setState({
            mode: "add_node",
            mouse_x: event.clientX,
            mouse_y: event.clientY,
            rel_orig_x: bounding_rect.left,
            rel_orig_y: bounding_rect.top,
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
      commands_bar = <CommandsBar active={this.state.mode === "add_node"} x={this.state.mouse_x} y={this.state.mouse_y} rel_orig_x={this.state.rel_orig_x} rel_orig_y={this.state.rel_orig_y}></CommandsBar>;
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
          <VisualEditor app_state={this.state} width={this.state.settings.layout.editor_width}></VisualEditor>
          <ResizeBorder settings={this.state.settings}></ResizeBorder>
          <Renderer
            visible={!this.state.settings.general.show_nodes}
            width={this.state.settings.layout.renderer_width}
            settings={this.state.settings.general}
          ></Renderer>
        </div>
      </ChakraProvider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);
