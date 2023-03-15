import settings_template from "./../settings_template.json";

function repairModel(model) {
  const default_units = {
    length: "m",
  };
  if (!model.hasOwnProperty("units")) {
    model.units = default_units;
  } else {
    Object.entries(default_units).forEach(([key, val]) => {
      if (!model.units.hasOwnProperty(key)) model.units[key] = val;
    });
  }
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
