import React from "react";
import { Switch, FormLabel, FormControl } from "@chakra-ui/react";
import settings_template from "./settings_template.json";
import state from "./state";
const {getState, setState} = state;

function ToggleSettings({ label, id, value, handleClick }) {
    return (
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor={id} mb="0">
          {label}
        </FormLabel>
          <Switch id={id} onChange={() => handleClick(id)} isChecked={value}/>
      </FormControl>
    );
}

class GlobalControlsWrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = getState("settings").general;
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(id) {
    let a = this.state;
    a[id] = !a[id];
    this.setState(a);
    setState({general: a}, "settings");
  }
  render(){
    let general_settings = settings_template.general;
    const settingsComponent = Object.entries(general_settings).map(
      ([key, value]) => {
        return (
          <ToggleSettings
            label={value.label}
            id={key}
            key={key}
            value={this.state[key]}
            handleClick={this.handleClick}
          ></ToggleSettings>
        );
      }
    );
    return settingsComponent;
  }
}

export default GlobalControlsWrapper;
