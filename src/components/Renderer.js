import Plot from "react-plotly.js";
import renderer from "../js/renderer";
import React from "react";

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

export default Renderer;
