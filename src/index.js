import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class ParamEle extends React.Component {
    render() {
        return (
            <div className="app-cont">

            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ParamEle />);