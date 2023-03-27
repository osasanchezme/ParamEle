import React from "react";
import utils from "../utils";
import state from "../state";

class ResizeBorder extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }
  handleMouseDown(e) {
    utils.changeAppMode("resizing_modules");
    state.setGlobalVariable("current_resizer", this.props.id);
  } 
  handleMouseUp(e) {
    utils.changeAppMode("wait_action");
  }
  render() {
    let visible = false;
    if (this.props.visible) visible = true;
    return (
      <div
        className="border-resizer"
        style={{ display: visible ? "block" : "none", left: String(this.props.position) + "%" }}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        <div className="small-circle up"></div>
        <div className="small-circle middle"></div>
        <div className="small-circle down"></div>
      </div>
    );
  }
}

export default ResizeBorder;
