import React from "react";
import { Switch, FormLabel, FormControl } from "@chakra-ui/react";
import settings_template from "../settings_template.json";

function ToggleSettings({ label, id, value, handleClick }) {
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor={id} mb="0">
        {label}
      </FormLabel>
      <Switch
        id={id}
        onChange={(evt) => handleClick(id, evt.target.checked)}
        isChecked={value}
      />
    </FormControl>
  );
}

class GlobalControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(id, value) {
    this.props.onSettingChange(id, value);
  }
  render() {
    let general_settings = settings_template.general;
    const settingsComponent = Object.entries(general_settings).map(
      ([key, value]) => {
        return (
          <ToggleSettings
            label={value.label}
            id={key}
            key={key}
            value={this.props.settings[key]}
            handleClick={this.handleClick}
          ></ToggleSettings>
        );
      }
    );
    return (
      <div className="global-controls">
        <div className="global-controls-hidden"></div>
        <div className="global-controls-container">
          {settingsComponent}
        </div>
      </div>);
  }
}

export default GlobalControls;
