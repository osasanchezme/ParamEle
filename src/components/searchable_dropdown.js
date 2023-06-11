import React from "react";
import { Input, List, ListItem, ListIcon, InputGroup, InputRightElement, Tag } from "@chakra-ui/react";
import utils from "../utils";
import { MdCropSquare } from "react-icons/md";
import state from "../state";
const { setGlobalVariable } = state;

class SearchableDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.inputReference = React.createRef();
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleMouseOverOnOption = this.handleMouseOverOnOption.bind(this);
    this.handleMouseClickOnOption = this.handleMouseClickOnOption.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.state = {
      nodes_to_select: [],
      selected_node: 0,
      selected_option: "",
      selected_option_name: Object.keys(this.props.options_map)[Object.values(this.props.options_map).indexOf(this.props.current_value)],
      list_visible: false,
    };
    this.available_nodes_mapping = this.props.options_map;
    this.coincidences_to_match = this.props.coincidences_to_match;
    this.onChange = this.props.onChange;
    this.tag_text = this.props.tag_text;
  }
  componentDidMount() {
    if (!this.props.is_regular_dropdown) {
      setGlobalVariable("last_node_id_created", "");
      this.inputReference.current.focus();
    }
  }
  /**
   * Handles the user input on the commands bar input
   * @param {KeyboardEvent} event
   */
  handleUserInput(event) {
    let node_name = event.target.value;
    let last_key = event.key;
    this.setState({ list_visible: true });
    if (last_key === "ArrowUp" || last_key === "ArrowDown") {
      if (last_key === "ArrowUp") {
        let potential_next_node = this.state.selected_node - 1;
        this.setState({
          selected_node: potential_next_node < 0 ? this.coincidences_to_match - 1 : potential_next_node,
        });
      } else {
        let potential_next_node = this.state.selected_node + 1;
        this.setState({
          selected_node: potential_next_node > this.coincidences_to_match - 1 ? 0 : potential_next_node,
        });
      }
    } else if (last_key === "Enter") {
      this.handleMouseClickOnOption();
    } else {
      let closest_nodes = [];
      if (node_name.length > 0) {
        closest_nodes = utils.getClosestMatches(node_name, Object.keys(this.available_nodes_mapping));
      } else {
        closest_nodes = Object.keys(this.available_nodes_mapping).map((option) => {
          return { name: option, score: 0 };
        });
      }
      if (this.props.is_regular_dropdown) this.coincidences_to_match = closest_nodes.length;
      this.setState({
        nodes_to_select: closest_nodes.slice(0, Math.min(this.coincidences_to_match, closest_nodes.length)).map((option) => {
          return option.name;
        }),
        selected_node: 0,
      });
    }
  }
  /**
   *
   * @param {KeyboardEvent} event
   */
  preventArrowKeysDefault(event) {
    let last_key = event.key;
    if (last_key === "ArrowUp" || last_key === "ArrowDown") event.preventDefault();
  }
  /**
   * Handles when the user places the mouse cursor over one of the node options
   * @param {MouseEvent} event
   */
  handleMouseOverOnOption(event) {
    this.setState({
      selected_node: Number(event.target.id),
    });
  }

  handleMouseClickOnOption() {
    let node_name = this.state.nodes_to_select[this.state.selected_node];
    let node_class = this.available_nodes_mapping[node_name];
    this.setState({ selected_option: node_class, selected_option_name: node_name, list_visible: false });
    this.onChange(node_class);
  }
  handleInputChange(event) {
    this.setState({ selected_option_name: event.target.value });
  }
  handleInputBlur() {
    this.handleMouseClickOnOption();
    this.setState({ list_visible: false });
  }
  render() {
    let style_for_options_list = { position: "relative" };
    if (this.props.is_regular_dropdown) {
      // Place the options list below the input
      style_for_options_list.top = this.props.style.top - 11;
      style_for_options_list.zIndex = 5;
    }
    let list_to_select = <List></List>;
    if (this.state.nodes_to_select.length > 0) {
      const options_list = this.state.nodes_to_select.map((option, option_i) => {
        return (
          <ListItem
            key={option}
            cursor={"pointer"}
            bg={option_i === this.state.selected_node ? "gray.300" : "gray.50"}
            borderRadius={"base"}
            onMouseOver={this.handleMouseOverOnOption}
            id={option_i}
            onClick={this.handleMouseClickOnOption}
            fontSize={this.props.is_regular_dropdown ? "xs" : "md"}
            paddingLeft={this.props.is_regular_dropdown ? "var(--chakra-space-2)" : "0"}
          >
            {this.props.is_regular_dropdown ? "" : <ListIcon as={MdCropSquare} />}
            {option}
          </ListItem>
        );
      });
      list_to_select = (
        <List spacing={0.5} padding={1} position="absolute" style={style_for_options_list}>
          {options_list}
        </List>
      );
    }
    return this.props.is_regular_dropdown ? (
      <>
        <div className={this.props.className} style={this.props.style}>
          <InputGroup size="xs">
            <Input
              ref={this.inputReference}
              placeholder={this.props.placeholder}
              size="xs"
              onKeyUp={this.handleUserInput}
              onKeyDown={this.preventArrowKeysDefault}
              value={this.state.selected_option_name === undefined ? "" : this.state.selected_option_name}
              onChange={this.handleInputChange}
              autoComplete="off"
              onFocus={this.handleUserInput}
              onBlur={this.handleInputBlur}
            />
            <InputRightElement width="3.8rem">
              <Tag
                size="sm"
                variant={"source"}
                style={{
                  position: "absolute",
                  right: "var(--chakra-space-1)",
                  minHeight: "var(--chakra-fontSizes-md)",
                  borderRadius: "var(--chakra-radii-base)",
                }}
              >
                {this.tag_text}
              </Tag>
            </InputRightElement>
          </InputGroup>
        </div>
        {this.state.list_visible ? list_to_select : ""}
      </>
    ) : (
      <div className={this.props.className} style={this.props.style}>
        <Input
          ref={this.inputReference}
          placeholder={this.props.placeholder}
          size="xs"
          onKeyUp={this.handleUserInput}
          onKeyDown={this.preventArrowKeysDefault}
          defaultValue=""
          autoComplete="off"
        />
        {this.state.list_visible ? list_to_select : ""}
      </div>
    );
  }
}

export default SearchableDropdown;
