import React from "react";
import library from "../flow-nodes/handler";
import { Input, List, ListItem, ListIcon } from "@chakra-ui/react";
import utils from "../utils";
import { MdCropSquare } from "react-icons/md";
import state from "../state";
const { getRfInstance } = state;

const top_bar_height = 50;
const commands_bar_height = 50;
const commands_bar_width = 100;
const number_nodes_match = 3;
const available_nodes = library.nodes;
const available_nodes_mapping = library.mapping;

class CommandsBar extends React.Component {
  constructor(props) {
    super(props);
    this.inputReference = React.createRef();
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleMouseOverOnOption = this.handleMouseOverOnOption.bind(this);
    this.handleMouseClickOnOption = this.handleMouseClickOnOption.bind(this);
    this.state = {
      nodes_to_select: [],
      selected_node: 0,
    };
  }
  componentDidMount() {
    this.inputReference.current.focus();
  }
  /**
   * Handles the user input on the commands bar input
   * @param {KeyboardEvent} event
   */
  handleUserInput(event) {
    let node_name = event.target.value;
    let last_key = event.key;
    if (last_key === "ArrowUp" || last_key === "ArrowDown") {
      event.preventDefault();
      if (last_key === "ArrowUp") {
        let potential_next_node = this.state.selected_node - 1;
        this.setState({
          selected_node: potential_next_node < 0 ? number_nodes_match - 1 : potential_next_node,
        });
      } else {
        let potential_next_node = this.state.selected_node + 1;
        this.setState({
          selected_node: potential_next_node > number_nodes_match - 1 ? 0 : potential_next_node,
        });
      }
    } else if (last_key === "Enter") {
      this.handleMouseClickOnOption();
    } else {
      let closest_nodes = [];
      if (node_name.length > 0) {
        closest_nodes = utils.getClosestMatches(node_name, Object.keys(available_nodes_mapping));
      }
      this.setState({
        nodes_to_select: closest_nodes.slice(0, Math.min(number_nodes_match, closest_nodes.length)).map((option) => {
          return option.name;
        }),
        selected_node: 0,
      });
    }
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
    let node_class = available_nodes_mapping[node_name];
    utils.addNodeToTheEditor(node_class, {x: this.props.x, y: this.props.y - top_bar_height});
    utils.changeAppMode("wait_action");
  }
  render() {
    let pos_x = this.props.x;
    let pos_y = this.props.y;
    let bar_visible = this.props.active;
    if (pos_y < 50 || pos_y > window.innerHeight - commands_bar_height || pos_x <= 0 || pos_x > window.innerWidth - commands_bar_width)
      bar_visible = false;
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
          >
            <ListIcon as={MdCropSquare} />
            {option}
          </ListItem>
        );
      });
      list_to_select = (
        <List spacing={0.5} padding={1}>
          {options_list}
        </List>
      );
    }
    return (
      <div
        className="commands-bar"
        style={{
          top: pos_y + "px",
          left: this.props.x + "px",
          display: bar_visible ? "block" : "none",
        }}
      >
        <Input ref={this.inputReference} placeholder="Nombre nodo..." size="xs" onKeyDown={this.handleUserInput} />
        {list_to_select}
      </div>
    );
  }
}

export default CommandsBar;
