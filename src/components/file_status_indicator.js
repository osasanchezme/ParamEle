import { Tag } from "@chakra-ui/react";
import utils from "../utils";
import PopoverForm from "./popover_form";
import { useRef } from "react";
import Firebase from "../js/firebase";
import file from "../js/file";

function localGetCopy(copy_key) {
  return utils.getDisplayCopy("nav_bar", copy_key);
}

function FileStatusIndicator({ file_data, setFileData }) {
  function localOpenFileManager() {
    if (file_name === null) {
      utils.openFileManager("save");
    }
  }
  function simulateClick() {
    if (file_name !== null) {
      tag_ref.current.click();
    }
  }
  function saveModelVersion(form_state) {
    let commit_msg = form_state.commit_msg.value;
    let model_blob = file.getModelBlob();
    let { model_id, file_name, file_path } = file_data;
    let version_id = Date.now();
    Firebase.saveFileToCloud(
      model_blob,
      file_name,
      model_id,
      version_id,
      file_path,
      (new_file) => {
        // Update the file data in the app state
        setFileData({ is_saved: true, last_saved: version_id });
      },
      true,
      commit_msg
    );
  }
  let { file_name, is_saved, last_saved } = file_data;
  let tag_ref = useRef(null);
  let tag_element = (
    <Tag height="30px" marginTop="10px" marginRight="10px" cursor="pointer" ref={tag_ref} onMouseOver={simulateClick} onClick={localOpenFileManager}>
      {file_name !== null ? file_name : localGetCopy("file_not_saved")}
      {is_saved ? "" : " *"}
    </Tag>
  );
  let current_time = Date.now();
  let difference = current_time - last_saved;
  let seconds = difference / 1000;
  let minutes = seconds / 60;
  let hours = minutes / 60;
  let days = hours / 24;
  let formatted_time = "";
  if (minutes < 1) {
    formatted_time = String(seconds.toFixed(0)) + " " + localGetCopy("seconds");
  } else if (hours < 1) {
    formatted_time = String(minutes.toFixed(0)) + " " + localGetCopy("minutes");
  } else if (days < 1) {
    formatted_time = String(hours.toFixed(0)) + " " + localGetCopy("hours");
  } else {
    let last_saved_date = new Date(last_saved);
    formatted_time = `${last_saved_date.toDateString()}, ${last_saved_date.toLocaleTimeString()}`;
  }
  formatted_time = `${localGetCopy("last_saved")}: ${formatted_time}`;
  if (file_name === null) {
    return tag_element;
  } else {
    return (
      <PopoverForm
        action_button_text={localGetCopy("save")}
        copies_key={"nav_bar"}
        action_function={saveModelVersion}
        fields={{
          commit_msg: {
            default: "",
            type: "text",
            validation: [],
            is_first_field: true,
            helper_text: formatted_time,
          },
        }}
        options={{ placement: "bottom" }}
      >
        {tag_element}
      </PopoverForm>
    );
  }
}

export default FileStatusIndicator;
