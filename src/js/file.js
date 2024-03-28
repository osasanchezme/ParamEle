import state from "../state";
import getState from "../getState";
import logic_runner from "./globalLogicRunner";
import blank_model from "../data/template-0.json";
import repair from "./repair";
import utils from "../utils";
import Firebase from "./firebase";

const downloadJSONFile = () => {
  downloadAnyFile("modelo.json", "text/json", getModelBlob());
};

const downloadAnyFile = (file_name, type, file_blob, no_blob) => {
  let a = document.createElement("a");
  a.download = file_name;
  let actual_file_blob = no_blob ? new Blob([file_blob], { type }) : file_blob;
  a.href = window.URL.createObjectURL(actual_file_blob);
  a.dataset.downloadurl = [type, a.download, a.href].join(":");
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

const getResultsBlob = () => {
  let results = getState("results");
  if (typeof results === "object" && Object.keys(results).length > 0) {
    results = JSON.stringify(results, undefined, 4);
    return new Blob([results], { type: "text/json" });
  } else {
    return false;
  }
};

const newFile = () => {
  clearURLParams();
  blank_model.settings = repair.repairSettings(blank_model.settings);
  state.setState(repair.repairModel(blank_model.model));
  let rf_instance = state.getRfInstance();
  rf_instance.setNodes(blank_model.model.nodes);
  rf_instance.setEdges(blank_model.model.edges);
  state.updateSettingsFromLocalState(blank_model.settings);
  logic_runner.run(blank_model.model);
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
        clearURLParams();
        let lines = e.target.result;
        var state_from_file = JSON.parse(lines);
        setModelAndResultsFromParsedBlob(state_from_file);
      };
      fr.readAsText(user_file);
    }
  };
};

const setModelAndResultsFromParsedBlob = (state_from_file, results_from_file) => {
  state_from_file.settings = repair.repairSettings(state_from_file.settings);
  state.setState(state_from_file);
  if (results_from_file) state.setState(results_from_file, "results");
  let rf_instance = state.getRfInstance();
  let model = repair.repairModel(state_from_file.model);
  rf_instance.setNodes(model.nodes);
  rf_instance.setEdges(model.edges);
  state.updateSettingsFromLocalState(state_from_file.settings);
  state.resetView();
  logic_runner.run(model);
};

/**
 *
 * @param {{id:string, current_version:number, history: Object.<number, object>}} data
 * @param {*} file_name
 * @param {*} fileManagerPath
 * @param {*} setFileData
 * @param {*} setModelLock
 */
const downloadAndOpenModel = (id, current_version, history, file_name, fileManagerPath, setFileData, setModelLock) => {
  utils.showLoadingDimmer("loading_model");
  let file_path = JSON.parse(JSON.stringify(fileManagerPath));
  let current_version_info = history[current_version];
  let { results_available } = current_version_info;
  setURLParams(fileManagerPath, file_name);
  Firebase.openFileFromCloud(id, current_version, "model", (model_data) => {
    setFileData({ file_name, is_saved: true, last_saved: current_version, model_id: id, file_path, current_version });
    if (results_available) {
      utils.setLoadingDimmerMsg("loading_results");
      Firebase.openFileFromCloud(id, current_version, "results", (results_data) => {
        setModelAndResultsFromParsedBlob(model_data, results_data);
        // TODO - Do not use the timeout, working everywhere with app state a no window variables should fix it
        setTimeout(() => {
          setModelLock(true);
          utils.hideLoadingDimmer();
        }, 1000);
      });
    } else {
      setModelAndResultsFromParsedBlob(model_data);
      setModelLock(false);
      utils.hideLoadingDimmer();
    }
  });
};

const getFileDataAndOpenModel = (file_path, file_name, setFileData, setModelLock, fileDoesNotExistCallback) => {
  Firebase.getProjectData(file_path, file_name, (file_data) => {
    let { current_version, history, id } = file_data;
    if (current_version == undefined || history == undefined || id == undefined) {
      fileDoesNotExistCallback();
    } else {
      downloadAndOpenModel(id, current_version, history, file_name, file_path, setFileData, setModelLock);
    }
  });
};

const setURLParams = (fileManagerPath, file_name) => {
  // Set query parameters based on user action
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.delete("path");
  queryParams.delete("name");
  queryParams.append("path", fileManagerPath);
  queryParams.append("name", file_name);

  // Update URL with new query parameters
  appendParamsToCurrentURL(queryParams);
};

/**
 * Updates the current URL in the browser with the parameters given in queryParams
 * @param {URLSearchParams} queryParams
 */
const appendParamsToCurrentURL = (queryParams) => {
  const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
  window.history.pushState({}, "", newUrl);
};

const getURLParams = () => {
  const queryParams = new URLSearchParams(window.location.search);
  let important_params = ["path", "name"];
  let params_object = {};
  important_params.forEach((param_key) => {
    params_object[param_key] = queryParams.get(param_key);
  });
  return params_object;
};

/**
 * Clears all the URL params except the language
 */
const clearURLParams = () => {
  const queryParams = new URLSearchParams(window.location.search);
  let important_params = ["path", "name"];
  important_params.forEach((param_key) => {
    queryParams.delete(param_key);
  });

  // Update URL with new query parameters
  appendParamsToCurrentURL(queryParams);
};

const reloadToBlank = () => {
  clearURLParams();
  window.location.reload();
};

const file = {
  downloadJSONFile,
  downloadAnyFile,
  uploadJSONFile,
  newFile,
  getModelBlob,
  setModelAndResultsFromParsedBlob,
  getResultsBlob,
  downloadAndOpenModel,
  getFileDataAndOpenModel,
  getURLParams,
  reloadToBlank,
  setURLParams
};
export default file;
