import utils from "../utils";
import settings_template from "./../settings_template.json";

function repairModel(model) {
  model.nodes.forEach((node) => {
    if (!node.data) node.data = {};
    node.data.aux = utils.getDefaultAuxData();
  });
  return model;
}

function repairSettings(settings) {
  Object.entries(settings_template).forEach(([global_key, global_setting]) => {
    let should_update_all = false;
    if (!settings.hasOwnProperty(global_key)) {
      should_update_all = true;
      settings[global_key] = {};
    }
    Object.entries(global_setting).forEach(([setting_key, setting]) => {
      if (should_update_all || !settings[global_key].hasOwnProperty(setting_key)) settings[global_key][setting_key] = setting.default;
    });
  });
  return settings;
}

const repair = { repairModel, repairSettings };

export default repair;
