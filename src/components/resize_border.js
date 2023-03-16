import React from "react";
import utils from "../utils";

class ResizeBorder extends React.Component {
  handleMouseDown(e) {
    utils.changeAppMode("resizing_modules");
  }
  handleMouseUp(e) {
    utils.changeAppMode("wait_action");
  }
  render() {
    let visible = false;
    if (this.props.settings.general.side_by_side) visible = true;
    return (
      <div
        className="border-resizer"
        style={{ display: visible ? "block" : "none", left: String(this.props.settings.layout.renderer_width) + "%" }}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      ></div>
    );
  }
}

export default ResizeBorder;
