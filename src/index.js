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
import PropertiesPanel from "./components/properties_panel";
import theme from "./theme";
import SelectionBox from "./components/selection_box";
import Navigator from "./components/navigator";
import GlobalSettings from "./components/global_settings";
import Authentication from "./components/authentication";
import FileManager from "./components/file_manager";
const { setInitialState, storeRfInstance, updateStateFromFlow } = state;

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
    let global_style = { zIndex: this.props.visible ? 4 : 3, width: String(this.props.width) + "%", right: this.props.layout.renderer_right + "%" };

    return (
      <div className={"renderer-container"} style={global_style}>
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
  global_style = { width: String(props.width) + "%", right: "0%" };
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
class ParamEle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...getState(),
      mouse_x: 0,
      mouse_y: 0,
      mode: "wait_action",
      rel_orig_x: 0,
      rel_orig_y: 0,
      selection_top: 0,
      selection_left: 0,
      user: null,
      file_name: null,
      is_saved: false,
      last_saved: null,
      model_id: null,
      file_path: null,
    };
    this.changeGeneralSettingValue = this.changeGeneralSettingValue.bind(this);
    window.ParamEle.changeGeneralSettingValue = this.changeGeneralSettingValue.bind(this);
    this.changeAppMode = this.changeAppMode.bind(this);
    window.ParamEle.changeAppMode = this.changeAppMode.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.activateNodeCreation = this.activateNodeCreation.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.updateComponentsWidth = this.updateComponentsWidth.bind(this);
    this.updateNodesFromLocalState = this.updateNodesFromLocalState.bind(this);
    window.ParamEle.updateNodesFromLocalState = this.updateNodesFromLocalState.bind(this);
    this.getUser = this.getUser.bind(this);
    window.ParamEle.getUser = this.getUser.bind(this);
    this.setUser = this.setUser.bind(this);
    window.ParamEle.setUser = this.setUser.bind(this);
    this.setFileData = this.setFileData.bind(this);
  }
  changeGeneralSettingValue(key, value) {
    let curr_settings = this.state.settings;
    curr_settings.general[key] = value;
    this.setState({ settings: curr_settings }, () => {
      if (key === "show_properties_panel") {
        this.updateComponentsWidth({ panel_width: value ? 20 : 0 });
      } else if (key === "side_by_side") {
        this.updateComponentsWidth({ panel_width: curr_settings.general.show_properties_panel ? curr_settings.layout.panel_width : 0 });
      }
    });
  }
  updateNodesFromLocalState() {
    let local_state = getState();
    this.setState({ model: local_state.model });
  }
  changeAppMode(mode) {
    this.setState({ mode });
  }
  getUser() {
    return this.state.user;
  }
  setUser(user) {
    this.setState({ user });
  }
  setFileData({ file_name, is_saved, last_saved, model_id, file_path }) {
    let update_obj = { file_name, is_saved, last_saved, model_id, file_path };
    let actual_update_object = {};
    Object.entries(update_obj).forEach(([key, val]) => {
      if (val !== undefined) actual_update_object[key] = val;
    });
    this.setState(actual_update_object);
  }
  getFileData() {
    return {
      file_name: this.state.file_name,
      is_saved: this.state.is_saved,
      last_saved: this.state.last_saved,
      model_id: this.state.model_id,
      file_path: this.state.file_path,
    };
  }

  /**
   *
   * @param {MouseEvent} event
   */
  handleMouseMove(event) {
    switch (this.state.mode) {
      case "resizing_modules":
        event.preventDefault();
        let current_resizer = state.getGlobalVariable("current_resizer");
        let relative_location;
        switch (current_resizer) {
          case "renderer_editor":
            relative_location = (event.clientX / window.innerWidth) * 100;
            this.updateComponentsWidth({ relative_pos_resize_2: relative_location });
            break;
          case "properties_panel":
            relative_location = (event.clientX / window.innerWidth) * 100;
            this.updateComponentsWidth({ relative_pos_resize_1: relative_location });
            break;
          default:
            break;
        }
        break;
      case "selecting_nodes":
        event.preventDefault();
        this.setState({ mouse_x: event.clientX, mouse_y: event.clientY });
        break;
      default:
        break;
    }
  }
  updateComponentsWidth(required_update) {
    let general = this.state.settings.general;
    let layout = this.state.settings.layout;
    let renderer_width = required_update.renderer_width;
    let renderer_right = required_update.renderer_right;
    let editor_width = required_update.editor_width;
    let panel_width = required_update.panel_width;
    let relative_pos_resize_1 = required_update.relative_pos_resize_1;
    let relative_pos_resize_2 = required_update.relative_pos_resize_2;
    let available_width;
    if (typeof relative_pos_resize_1 !== "undefined") {
      available_width = 100 - relative_pos_resize_1;
      if (general.side_by_side) {
        renderer_width = layout.renderer_width;
        editor_width = available_width - renderer_width;
        renderer_right = editor_width;
      } else {
        renderer_width = available_width;
        editor_width = available_width;
        renderer_right = 0;
      }
      this.setState({
        settings: {
          ...this.state.settings,
          layout: { panel_width: relative_pos_resize_1, renderer_width, editor_width, renderer_right },
        },
      });
    } else if (typeof relative_pos_resize_2 !== "undefined") {
      if (general.show_properties_panel) {
        panel_width = layout.panel_width;
        available_width = 100 - panel_width;
      } else {
        panel_width = 0;
        available_width = 100;
      }
      renderer_width = relative_pos_resize_2 - panel_width;
      editor_width = available_width - renderer_width;
      renderer_right = editor_width;
      this.setState({
        settings: {
          ...this.state.settings,
          layout: { panel_width, renderer_width, editor_width, renderer_right },
        },
      });
    } else if (typeof panel_width !== "undefined") {
      available_width = 100 - panel_width;
      if (general.side_by_side) {
        editor_width = 0.5 * available_width;
        renderer_width = available_width - editor_width;
        renderer_right = editor_width;
      } else {
        editor_width = available_width;
        renderer_width = available_width;
        renderer_right = 0;
      }
      this.setState({
        settings: {
          ...this.state.settings,
          layout: { panel_width, renderer_width, editor_width, renderer_right },
        },
      });
    }
  }
  activateNodeCreation(event) {
    if (this.state.mode === "wait_action") {
      state.deselectAllNodes();
      let bounding_rect = event.target.getBoundingClientRect();
      this.setState({
        mode: "add_node",
        mouse_x: event.clientX,
        mouse_y: event.clientY,
        rel_orig_x: bounding_rect.left,
        rel_orig_y: bounding_rect.top,
      });
    }
  }
  handleKeyPress(event) {
    switch (event.key) {
      case "Escape":
        this.setState({ mode: "wait_action" });
        state.deselectAllNodes();
        break;
      case "Enter":
        state.setGlobalVariable("user_interaction_step", "done");
        break;
      default:
        break;
    }
  }
  handleMouseClick(event) {
    if (event.target.className === "react-flow__pane react-flow__container") {
      if (!event.ctrlKey) {
        this.activateNodeCreation(event);
      }
    }
  }
  handleMouseUp(event) {
    if (this.state.mode === "selecting_nodes") {
      state.highlightSelectedNodes(
        this.state.selection_left,
        this.state.selection_top,
        this.state.mouse_x,
        this.state.mouse_y,
        this.state.rel_orig_x,
        this.state.rel_orig_y
      );
    }
    this.changeAppMode("wait_action");
  }
  /**
   *
   * @param {MouseEvent} event
   */
  handleMouseDown(event) {
    if (event.target.className === "react-flow__pane react-flow__container" && event.ctrlKey) {
      let bounding_rect = event.target.getBoundingClientRect();
      this.changeAppMode("selecting_nodes");
      this.setState({ selection_top: event.clientY, selection_left: event.clientX, rel_orig_x: bounding_rect.left, rel_orig_y: bounding_rect.top });
    }
  }
  render() {
    let commands_bar;
    if (this.state.mode === "add_node") {
      commands_bar = (
        <CommandsBar
          active={this.state.mode === "add_node"}
          x={this.state.mouse_x}
          y={this.state.mouse_y}
          rel_orig_x={this.state.rel_orig_x}
          rel_orig_y={this.state.rel_orig_y}
        ></CommandsBar>
      );
    }
    let panel_plus_renderer = Number(this.state.settings.layout.renderer_width);
    if (this.state.settings.general.show_properties_panel) panel_plus_renderer += Number(this.state.settings.layout.panel_width);
    return (
      <ChakraProvider theme={theme}>
        <div
          className="app-cont"
          tabIndex={0}
          onKeyDown={this.handleKeyPress}
          onMouseMove={this.handleMouseMove}
          onClick={this.handleMouseClick}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        >
          <NavBar
            user={this.state.user}
            file_data={this.getFileData()}
            setFileData={this.setFileData}
          ></NavBar>
          <GlobalControls onSettingChange={this.changeGeneralSettingValue} settings={this.state.settings.general}></GlobalControls>
          {commands_bar}
          <PropertiesPanel
            visible={this.state.settings.general.show_properties_panel}
            width={this.state.settings.layout.panel_width}
            data={this.state.model}
          ></PropertiesPanel>
          <ResizeBorder
            id="properties_panel"
            visible={this.state.settings.general.show_properties_panel}
            position={this.state.settings.layout.panel_width}
          ></ResizeBorder>
          <VisualEditor app_state={this.state} width={this.state.settings.layout.editor_width}></VisualEditor>
          <Navigator layout={this.state.settings.layout}></Navigator>
          <ResizeBorder id="renderer_editor" visible={this.state.settings.general.side_by_side} position={panel_plus_renderer}></ResizeBorder>
          <Renderer
            visible={!this.state.settings.general.show_nodes}
            width={this.state.settings.layout.renderer_width}
            settings={this.state.settings.general}
            layout={this.state.settings.layout}
          ></Renderer>
          <SelectionBox
            visible={this.state.mode === "selecting_nodes"}
            x={this.state.selection_left}
            y={this.state.selection_top}
            mouse_x={this.state.mouse_x}
            mouse_y={this.state.mouse_y}
          ></SelectionBox>
          <GlobalSettings></GlobalSettings>
          <Authentication user={this.state.user}></Authentication>
          <FileManager user={this.state.user} setFileData={this.setFileData}></FileManager>
        </div>
      </ChakraProvider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);
