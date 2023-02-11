function getState(key) {
  let state = JSON.parse(JSON.stringify(window.ParamEle.state));
  if (key !== undefined) state = state[key];
  return state;
}

export default getState;