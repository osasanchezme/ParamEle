import { Button, List, ListIcon, ListItem, Icon, Flex, Spacer } from "@chakra-ui/react";
import React from "react";
import * as MaterialDesign from "react-icons/md";
import boxes from "../js/boxes";
import file from "../js/file";
import structure from "../js/structure";
import utils from "../utils";
import FileStatusIndicator from "./file_status_indicator";

function localGetCopy(node_name) {
  return utils.getDisplayCopy("nav_bar", node_name);
}

function getNavBarOptions({ new_file_callback, solve_file_callback, open_version_manager_callback }) {
  return {
    file: {
      icon: "MdInsertDriveFile",
      options: [
        { name: localGetCopy("new"), icon: "MdInsertDriveFile", callback: new_file_callback },
        {
          name: localGetCopy("open"),
          icon: "MdFolderOpen",
          callback: () => {
            utils.openFileManager("open");
          },
        },
        {
          name: localGetCopy("save"),
          icon: "MdSave",
          callback: () => {
            utils.openFileManager("save");
          },
        },
        { name: localGetCopy("version_history"), icon: "MdOutlineHistory", callback: open_version_manager_callback },
        { name: localGetCopy("export_json"), icon: "MdFileDownload", callback: file.downloadJSONFile },
        { name: localGetCopy("import_json"), icon: "MdFileUpload", callback: file.uploadJSONFile },
      ],
    },
    boxes: {
      icon: "MdCropSquare",
      options: [
        { name: localGetCopy("group"), icon: "MdGroupWork", callback: boxes.groupBoxes },
        { name: localGetCopy("edit_logic"), icon: "MdEdit", callback: boxes.editInternalLogic },
        { name: localGetCopy("delete"), icon: "MdDelete", callback: boxes.deleteBoxes },
      ],
    },
    structure: {
      icon: "MdFoundation",
      options: [{ name: localGetCopy("solve"), icon: "MdPlayCircle", callback: solve_file_callback }],
    },
    settings: {
      icon: "MdSettings",
      callback: utils.openGlobalSettings,
    },
  };
}

function getRightNavBarOptions({open_authentication_callback}) {
  return {
    account: {
      icon: "MdAccountCircle",
      callback: open_authentication_callback,
      auth_behavior: {
        auth: { visible: false },
        no_auth: { visible: true },
      },
    },
    user: {
      icon: "MdAccountCircle",
      callback: open_authentication_callback,
      auth_behavior: {
        auth: { visible: true },
        no_auth: { visible: false },
      },
      options: [{ name: localGetCopy("log_out"), icon: "MdExitToApp", callback: utils.signOut }],
    },
  };
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dropdown_visible: false, mouse_on_menu: false, current_menu: "file", current_menu_index: 0, active_group: "left" };
    this.handleChange = this.handleChange.bind(this);
    this.navbar_options = getNavBarOptions({
      new_file_callback: function () {
        props.setFileData({ file_name: null, is_saved: false, last_saved: null, model_id: null, file_path: null, current_version: null });
        file.newFile();
      },
      solve_file_callback: function () {
        props.setModelLock(true);
        structure.solveStructure();
      },
      open_version_manager_callback: function () {
        props.openVersionManager();
      }
    });
    this.right_navbar_options = getRightNavBarOptions({
      open_authentication_callback: function () {
        props.openAuthenticationForm();
      }
    });
  }
  handleChange(dropdown_visible, mouse_on_menu) {
    this.setState({ dropdown_visible, mouse_on_menu });
  }
  render() {
    let current_options = [];
    let right_style = "";
    let left_style = "";
    let right_index = 0;
    if (this.state.active_group === "left") {
      current_options = this.navbar_options[this.state.current_menu]["options"];
      left_style = String(150 * this.state.current_menu_index) + "px";
    } else if (this.state.active_group === "right") {
      current_options = this.right_navbar_options[this.state.current_menu]["options"];
      right_style = String(150 * this.state.current_menu_index) + "px";
    }
    if (!current_options) current_options = [];
    return (
      <div className="nav-bar">
        <Flex direction="row" spacing={0} className="nav-bar-button-group">
          {Object.entries(this.navbar_options).map(([nav_menu_key, nav_menu_options], index) => (
            <Button
              key={`${nav_menu_key}-nav-bar-btn`}
              width="150px"
              className="nav-bar-button"
              leftIcon={<Icon as={MaterialDesign[nav_menu_options.icon]} />}
              rightIcon={nav_menu_options.options ? <MaterialDesign.MdKeyboardArrowDown /> : ""}
              colorScheme="gray"
              variant="ghost"
              onMouseEnter={() => {
                this.handleChange(true, false);
                this.setState({ current_menu: nav_menu_key, current_menu_index: index + 1, active_group: "left" });
              }}
              onMouseLeave={() => {
                if (!this.state.mouse_on_menu) {
                  this.handleChange(false, false);
                }
              }}
              onClick={() => {
                if (!nav_menu_options.options) {
                  nav_menu_options.callback();
                }
              }}
            >
              {localGetCopy(nav_menu_key)}
            </Button>
          ))}
          <Spacer></Spacer>
          <FileStatusIndicator file_data={this.props.file_data} setFileData={this.props.setFileData} model_locked={this.props.model_locked} setModelLock={this.props.setModelLock} />
          {Object.entries(this.right_navbar_options).map(([nav_menu_key, nav_menu_options], index) => {
            let display_copy = localGetCopy(nav_menu_key);
            if (nav_menu_key === "user" && this.props.user) display_copy = this.props.user.displayName || display_copy;
            if (
              (this.props.user === null && nav_menu_options.auth_behavior.no_auth.visible) ||
              (this.props.user !== null && nav_menu_options.auth_behavior.auth.visible)
            ) {
              right_index++;
              return (
                <Button
                  key={`${nav_menu_key}-nav-bar-btn`}
                  width="150px"
                  className="nav-bar-button"
                  leftIcon={<Icon as={MaterialDesign[nav_menu_options.icon]} />}
                  rightIcon={nav_menu_options.options ? <MaterialDesign.MdKeyboardArrowDown /> : ""}
                  // colorScheme="gray"
                  // variant="ghost"
                  onMouseEnter={() => {
                    this.handleChange(true, false);
                    this.setState({ current_menu: nav_menu_key, current_menu_index: right_index - 1, active_group: "right" });
                  }}
                  onMouseLeave={() => {
                    if (!this.state.mouse_on_menu) {
                      this.handleChange(false, false);
                    }
                  }}
                  onClick={() => {
                    if (!nav_menu_options.options) {
                      nav_menu_options.callback();
                    }
                  }}
                >
                  {display_copy}
                </Button>
              );
            }
          })}
        </Flex>
        <NavMenu
          left={left_style}
          right={right_style}
          options={current_options}
          visibility={this.state.dropdown_visible ? "visible" : "hidden"}
          handleChange={this.handleChange}
        ></NavMenu>
      </div>
    );
  }
}

class NavMenu extends React.Component {
  render() {
    const options_list = this.props.options.map((option) => {
      return (
        <ListItem
          height="40px"
          paddingTop="7px"
          paddingLeft="7px"
          _hover={{ background: "whitesmoke" }}
          cursor="pointer"
          key={option.name}
          onClick={() => option.callback()}
        >
          <ListIcon as={MaterialDesign[option.icon]} />
          {option.name}
        </ListItem>
      );
    });

    return (
      <List
        position="absolute"
        left={this.props.left}
        right={this.props.right}
        spacing={0}
        border="2px"
        borderBottomRadius="md"
        borderColor="whitesmoke"
        backgroundColor="white"
        width="150px"
        visibility={this.props.visibility}
        onMouseLeave={() => {
          this.props.handleChange(false, false);
        }}
        onMouseEnter={() => this.props.handleChange(true, true)}
      >
        {options_list}
      </List>
    );
  }
}

export default NavBar;
