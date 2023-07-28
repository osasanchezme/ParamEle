import state from "../state";
import getState from "../getState";
import logic_runner from "./globalLogicRunner";
import blank_model from "../data/template-0.json";
import repair from "./repair";

const downloadJSONFile = () => {
  var fileName = "modelo.json";
  let a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(getModelBlob());
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  a.click();
};

const getModelBlob = () => {
  let current_state = getState();
  current_state.model.nodes.forEach((node) => {
    if (node.data.input) delete node.data.input;
    return node;
  });
  current_state = { model: current_state.model, settings: current_state.settings };

  if (typeof current_state === "object") {
    current_state = JSON.stringify(current_state, undefined, 4);
  }

  return new Blob([current_state], { type: "text/json" });
};

const newFile = () => {
  blank_model.settings = repair.repairSettings(blank_model.settings);
  state.setState(repair.repairModel(blank_model));
  let rf_instance = state.getRfInstance();
  rf_instance.setNodes(blank_model.model.nodes);
  rf_instance.setEdges(blank_model.model.edges);
  state.updateSettingsFromLocalState(blank_model.settings);
  logic_runner.run();
};

const uploadJSONFile = () => {
  let a = document.createElement("input");
  a.type = "file";
  a.click();
  a.onchange = () => {
    if (a.files.length > 0) {
      if (typeof window.FileReader !== "function") {
        alert("The file API isn't supported on this browser yet.");
        return;
      }
      let user_file = a.files[0];
      let fr = new FileReader();
      fr.onload = function (e) {
        let lines = e.target.result;
        var state_from_file = JSON.parse(lines);
        setModelFromParsedBlob(state_from_file);
      };
      fr.readAsText(user_file);
    }
  };
};

const setModelFromParsedBlob = (state_from_file) => {
  state_from_file.settings = repair.repairSettings(state_from_file.settings);
  state.setState(repair.repairModel(state_from_file));
  let rf_instance = state.getRfInstance();
  let model = repair.repairModel(state_from_file.model);
  rf_instance.setNodes(model.nodes);
  rf_instance.setEdges(model.edges);
  state.updateSettingsFromLocalState(state_from_file.settings);
  state.resetView();
  logic_runner.run();
};

const file = { downloadJSONFile, uploadJSONFile, newFile, getModelBlob, setModelFromParsedBlob };
export default file;
