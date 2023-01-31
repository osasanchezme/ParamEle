import state from "../state";
const downloadJSONFile = () => {
  let current_state = state.getState();
  var fileName = "modelo.json";

  if (typeof current_state === "object") {
    current_state = JSON.stringify(current_state, undefined, 4);
  }

  let blob = new Blob([current_state], { type: "text/json" });
  let a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  a.click();
};

const uploadJSONFile = () => {
  let a = document.createElement("input");
  a.type = "file";
  a.click();
  a.onchange = () => {
    if (a.files.length > 0) {
      if (typeof window.FileReader !== "function") {
        // TODO - Create a global alert/notification manager
        alert("The file API isn't supported on this browser yet.");
        return;
      }
      let user_file = a.files[0];
      let fr = new FileReader();
      fr.onload = function (e) {
        let lines = e.target.result;
        var state_from_file = JSON.parse(lines);
        state.setState(state_from_file);
        let rf_instance = state.getRfInstance();
        rf_instance.setNodes(state_from_file.model.nodes);
        // rf_instance.setEdges(state_from_file.model.edges);
      };
      fr.readAsText(user_file);
    }
  };
};

const file = { downloadJSONFile, uploadJSONFile };
export default file;
