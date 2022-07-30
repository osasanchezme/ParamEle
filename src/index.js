import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";

class NavBar extends React.Component {
  render() {
    return <div className="nav-bar"></div>;
  }
}
class Renderer extends React.Component {
  render() {
    return <div className="renderer-container"></div>;
  }
}
class VisualEditor extends React.Component {
  render() {
    return <div className="editor-container"></div>;
  }
}

class GlobalControls extends React.Component {
  render() {
    return (
      <div className="global-controls">
        <div className="global-controls-hidden"></div>
        <div className="global-controls-container"></div>
      </div>
    );
  }
}

class ParamEle extends React.Component {
  render() {
    return (
      <ChakraProvider>
        <div className="app-cont">
          <NavBar></NavBar>
          <GlobalControls></GlobalControls>
          <VisualEditor></VisualEditor>
          <Renderer></Renderer>
        </div>
      </ChakraProvider>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);
