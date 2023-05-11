function getState(key) {
  let state = JSON.parse(JSON.stringify(window.ParamEle.state));
  if (key !== undefined && key !== "model") {
    state = state[key];
  } else if (key === "model") {
    let model_path = state.model_path;
    for (let i = 0; i < model_path.length; i++) {
      state = state[model_path[i]];
    }
  }
  return state;
}

export default getState;
