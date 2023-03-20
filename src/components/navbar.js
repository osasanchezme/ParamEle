import { Button, Stack, List, ListIcon, ListItem } from "@chakra-ui/react";
import React from "react";
import * as MaterialDesign from "react-icons/md";
import file from "../js/file";
import utils from "../utils";

function localGetCopy(node_name) {
  return utils.getDisplayCopy("nav_bar", node_name);
}

function getNavBarOptions() {
  return {
    file: [
      { name: localGetCopy("new"), icon: "MdInsertDriveFile", callback: file.newFile },
      { name: localGetCopy("open"), icon: "MdFolderOpen" },
      { name: localGetCopy("save"), icon: "MdSave" },
      { name: localGetCopy("export_json"), icon: "MdFileDownload", callback: file.downloadJSONFile },
      { name: localGetCopy("import_json"), icon: "MdFileUpload", callback: file.uploadJSONFile },
    ],
  };
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dropdown_visible: false, mouse_on_menu: false };
    this.handleChange = this.handleChange.bind(this);
    this.navbar_options = getNavBarOptions();
  }
  handleChange(dropdown_visible, mouse_on_menu) {
    this.setState({ dropdown_visible, mouse_on_menu });
  }
  render() {
    return (
      <div className="nav-bar">
        <Stack direction="row" spacing={0} className="nav-bar-button-group">
          <Button
            id="file-nav-bar-btn"
            width="150px"
            className="nav-bar-button"
            leftIcon={<MaterialDesign.MdInsertDriveFile />}
            rightIcon={<MaterialDesign.MdKeyboardArrowDown />}
            colorScheme="gray"
            variant="ghost"
            onMouseEnter={() => {
              this.handleChange(true, false);
            }}
            onMouseLeave={() => {
              if (!this.state.mouse_on_menu) {
                this.handleChange(false, false);
              }
            }}
          >
            {localGetCopy("file")}
          </Button>
        </Stack>
        <NavMenu
          options={this.navbar_options["file"]}
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
        left="150px"
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
