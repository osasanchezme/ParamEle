import React from "react";
import library from "../flow-nodes/handler";

const commands_bar_height = 50;
const commands_bar_width = 100;
const available_nodes = library.nodes;
const available_nodes_mapping = library.mapping;

class CommandsBar extends React.Component {
  render() {
    let pos_x = this.props.x;
    let pos_y = this.props.y;
    let bar_visible = this.props.active;
    if (
      pos_y < 50 ||
      pos_y > window.innerHeight - commands_bar_height ||
      pos_x <= 0 ||
      pos_x > window.innerWidth - commands_bar_width
    )
      bar_visible = false;
    return (
      <div
        className="commands-bar"
        style={{
          top: pos_y + "px",
          left: this.props.x + "px",
          display: bar_visible ? "block" : "none",
        }}
      >
        {this.props.x},{pos_y}
        <br></br>
        Visible: {String(this.props.active)}
      </div>
    );
  }
}

export default CommandsBar;
