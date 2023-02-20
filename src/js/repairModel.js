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

export default repairModel;
