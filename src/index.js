import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./flowNodes.css";
import { ChakraProvider } from "@chakra-ui/react";
import GlobalControls from "./components/settings";
import NavBar from "./components/navbar";
import state, { setInitialState, updateStateFromFlow } from "./state";
import CommandsBar from "./components/commands_bar";
import getState from "./getState";
import ResizeBorder from "./components/resize_border";
import PropertiesPanel from "./components/properties_panel";
import theme from "./theme";
import SelectionBox from "./components/selection_box";
import Navigator from "./components/navigator";
import GlobalSettings from "./components/global_settings";
import Authentication from "./components/authentication";
import FileManager from "./components/file_manager";
import { LoadingDimmer } from "./components/loading_dimmer";
import utils from "./utils";
import VisualEditor, { deselectAllNodesAndHandles } from "./components/VisualEditor";
import createNodesLibrary from "./flow-nodes/handler";
import Renderer from "./components/Renderer";
import VersionManager from "./components/version_manager";
import Firebase from "./js/firebase";
import { ConfirmationDialog } from "./components/confirmation_dialog";
import file from "./js/file";
import { notify } from "./components/notification";
import { getInitialState } from "./initial_state";
import { AppModeContext } from "./Context";

setInitialState();
const library = createNodesLibrary();
const nodes_library = library.nodes;
window.ParamEle.updateStateFromFlow = updateStateFromFlow;
window.ParamEle.nodesLibrary = library;

class ParamEle extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    this.changeGeneralSettingValue = this.changeGeneralSettingValue.bind(this);
    window.ParamEle.changeGeneralSettingValue = this.changeGeneralSettingValue.bind(this);
    this.changeAppMode = this.changeAppMode.bind(this);
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
    this.setModelLock = this.setModelLock.bind(this);
    this.openVersionManager = this.openVersionManager.bind(this);
    this.closeVersionManager = this.closeVersionManager.bind(this);
    this.openConfirmationDialog = this.openConfirmationDialog.bind(this);
    this.closeConfirmationDialog = this.closeConfirmationDialog.bind(this);
    this.openAuthenticationForm = this.openAuthenticationForm.bind(this);
    this.closeAuthenticationForm = this.closeAuthenticationForm.bind(this);
    this.setActiveTabAuthenticationForm = this.setActiveTabAuthenticationForm.bind(this);
    this.openFileManager = this.openFileManager.bind(this);
    this.closeFileManager = this.closeFileManager.bind(this);
    this.setNodes = this.setNodes.bind(this);
    this.setEdges = this.setEdges.bind(this);

    // Manage auth state changes - This is the last thing that loads
    Firebase.attachToAuthChangeFirebaseEvent((user) => {
      let params_object = file.getURLParams();
      let { path, name } = params_object;
      let is_params_available = path !== null && name !== null;
      if (user) {
        utils.setUser(user);
        utils.hideLoadingDimmer();
        if (is_params_available) {
          let file_path = path.split(",");
          file.getFileDataAndOpenModel(file_path, name, this.setFileData, this.setModelLock, () => {
            notify("warning", "file_does_not_exist", undefined, true);
          });
        }
      } else {
        utils.setUser(null);
        utils.hideLoadingDimmer();
        if (is_params_available) {
          // Show notification and open the auth form to log in
          notify("warning", "not_logged_in_cannot_access_file", undefined, true);
          this.openAuthenticationForm("log_in");
        }
      }
    });
  }
  componentDidMount() {
    utils.showLoadingDimmer();
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
  /**
   *
   * @param {*} update_function Function that receives the original nodes and applies some update to them
   */
  setNodes(update_function) {
    let nodes = update_function(this.state.nodes);
    this.setState({ nodes });
  }
  /**
   *
   * @param {*} update_function Function that receives the original edges and applies some update to them
   */
  setEdges(update_function) {
    let edges = update_function(this.state.edges);
    this.setState({ edges });
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
  setFileData({ file_name, is_saved, last_saved, model_id, file_path, current_version }) {
    let update_obj = { file_name, is_saved, last_saved, model_id, file_path, current_version };
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
  setModelLock(model_locked) {
    if (!model_locked) state.setState({}, "results");
    this.setState({ model_locked });
  }
  openVersionManager() {
    if (this.state.is_saved) {
      Firebase.getProjectData(this.state.file_path, this.state.file_name, (full_file_data) => {
        this.setState({ file_history: full_file_data.history }, () => {
          this.setState({ is_version_manager_open: true });
        });
      });
    } else {
      notify("warning", "save_to_view_history", undefined, true);
    }
  }
  closeVersionManager() {
    this.setState({ is_version_manager_open: false });
  }
  openConfirmationDialog(message, callbacks) {
    this.setState({ is_confirmation_open: true, confirmation_msg: message, confirmation_callbacks: callbacks });
  }
  closeConfirmationDialog() {
    this.setState({ is_confirmation_open: false });
  }
  openAuthenticationForm(active_tab_auth_form) {
    this.setState({ is_auth_form_open: true, active_tab_auth_form: active_tab_auth_form || "sign_up" });
  }
  closeAuthenticationForm() {
    this.setState({ is_auth_form_open: false });
  }
  setActiveTabAuthenticationForm(active_tab_auth_form) {
    this.setState({ active_tab_auth_form });
  }
  openFileManager(mode) {
    if (this.state.user == null && mode == "save") {
      this.openAuthenticationForm("log_in");
      notify("warning", "log_in_to_save", undefined, true);
    } else {
      this.setState({ is_file_manager_open: true, file_manager_mode: mode });
    }
  }
  closeFileManager() {
    this.setState({ is_file_manager_open: false });
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
      deselectAllNodesAndHandles();
      let bounding_rect = event.target.getBoundingClientRect();
      let mouse_x = event.clientX;
      let mouse_y = event.clientY;
      let height = 50;
      let width = 0;
      if (mouse_y > 50 && mouse_y < window.innerHeight - height && mouse_x > 0 && mouse_x < window.innerWidth - width) {
        this.setState({
          mode: "add_node",
          mouse_x: event.clientX,
          mouse_y: event.clientY,
          rel_orig_x: bounding_rect.left,
          rel_orig_y: bounding_rect.top,
        });
      }
    }
  }
  handleKeyPress(event) {
    switch (event.key) {
      case "Escape":
        this.setState({ mode: "wait_action" });
        deselectAllNodesAndHandles();
        break;
      case "Enter":
        state.setGlobalVariable("user_interaction_step", "done");
        break;
      default:
        break;
    }
  }
  handleMouseClick(event) {
    if (event.target.className === "react-flow__pane") {
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
      this.changeAppMode("wait_action");
    }
  }
  /**
   *
   * @param {MouseEvent} event
   */
  handleMouseDown(event) {
    if (event.target.className === "react-flow__pane" && event.ctrlKey) {
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
          changeAppMode={this.changeAppMode}
        ></CommandsBar>
      );
    }
    let panel_plus_renderer = Number(this.state.settings.layout.renderer_width);
    if (this.state.settings.general.show_properties_panel) panel_plus_renderer += Number(this.state.settings.layout.panel_width);
    return (
      <AppModeContext.Provider value={this.state.mode}>
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
            <LoadingDimmer></LoadingDimmer>
            <ConfirmationDialog
              isDialogOpen={this.state.is_confirmation_open}
              closeDialog={this.closeConfirmationDialog}
              callbacks={this.state.confirmation_callbacks}
              message_copy={this.state.confirmation_msg}
            ></ConfirmationDialog>
            <NavBar
              user={this.state.user}
              file_data={this.getFileData()}
              setFileData={this.setFileData}
              model_locked={this.state.model_locked}
              setModelLock={this.setModelLock}
              openVersionManager={this.openVersionManager}
              openAuthenticationForm={this.openAuthenticationForm}
              openFileManager={this.openFileManager}
              changeAppMode={this.changeAppMode}
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
              changeAppMode={this.changeAppMode}
            ></ResizeBorder>
            <VisualEditor
              nodes={this.state.nodes}
              setNodes={this.setNodes}
              edges={this.state.edges}
              setEdges={this.setEdges}
              show_mini_map={this.state.settings.general.mini_map}
              width={this.state.settings.layout.editor_width}
              nodes_library={nodes_library}
              is_model_locked={this.state.model_locked}
            ></VisualEditor>
            <Navigator layout={this.state.settings.layout}></Navigator>
            <ResizeBorder
              id="renderer_editor"
              visible={this.state.settings.general.side_by_side}
              position={panel_plus_renderer}
              changeAppMode={this.changeAppMode}
            ></ResizeBorder>
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
            <Authentication
              user={this.state.user}
              is_auth_form_open={this.state.is_auth_form_open}
              closeAuthenticationForm={this.closeAuthenticationForm}
              active_tab_auth_form={this.state.active_tab_auth_form}
              setActiveTabAuthenticationForm={this.setActiveTabAuthenticationForm}
            ></Authentication>
            <FileManager
              user={this.state.user}
              is_file_manager_open={this.state.is_file_manager_open}
              closeFileManager={this.closeFileManager}
              file_manager_mode={this.state.file_manager_mode}
              setFileData={this.setFileData}
              setModelLock={this.setModelLock}
            ></FileManager>
            <VersionManager
              isOpen={this.state.is_version_manager_open}
              file_history={this.state.file_history}
              file_name={this.state.file_name}
              file_path={this.state.file_path}
              onClose={this.closeVersionManager}
              model_id={this.state.model_id}
              current_version={this.state.current_version}
              setFileData={this.setFileData}
              setModelLock={this.setModelLock}
              openConfirmationDialog={this.openConfirmationDialog}
            ></VersionManager>
          </div>
        </ChakraProvider>
      </AppModeContext.Provider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);
