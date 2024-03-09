import notification from "../components/notification";
import getState from "../getState";
import state from "../state";
import utils from "../utils";
import { Link, Icon } from "@chakra-ui/react";
import { MdOpenInNew } from "react-icons/md";
import logic_runner from "./globalLogicRunner";

import file from "./file";
import { parsers } from "../submodulesAPI";

const solveStructure = () => {
  let structure = getState("structure");
  let global_settings = getState("settings")["global"];
  //   let file_name = Date.now();
  let file_name = "my_model_" + Date.now();
  let api_object = {
    auth: {
      // username: "oscar.sanchez@skyciv.com",
      // key: "1zQdtsDoca671lIvToi5laZjMWnc33UrBQZL5YYeagvn8fPRRMQwmEVubyIguj88",
      username: global_settings.solver_username,
      key: global_settings.solver_key,
    },
    functions: [
      {
        function: "S3D.session.start",
        arguments: {
          keep_open: false,
        },
      },
      {
        function: "S3D.model.set",
        arguments: {
          s3d_model: structure,
        },
      },
      {
        function: "S3D.model.mesh",
        arguments: {
          method: "delaunay",
          granularity: 3,
        },
      },
      {
        function: "S3D.file.save",
        arguments: {
          name: file_name,
          path: "api/paramele/",
          public_share: false,
        },
      },
      {
        function: "S3D.model.solve",
        arguments: {
          analysis_type: "linear",
          repair_model: true,
        },
      },
      {
        function: "S3D.file.save",
        arguments: {
          name: file_name,
          path: "api/paramele/",
          public_share: false,
        },
      },
    ],
  };
  notification.notify("info", "requested_solve", "", true, 90000);
  fetch("https://api.skyciv.com/v3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(api_object),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success");
      console.log(data);
      let already_open = false;
      notification.closeAllNotifications();
      if (data.functions) {
        data.functions.forEach((func) => {
          switch (func.function) {
            case "S3D.model.solve":
              state.setState(func.data, "results");
              notification.notify("info", "results_saved", null, true);
              // Run the logic to get the results plot
              logic_runner.run();
              break;
            case "S3D.file.save":
              if (!already_open) {
                already_open = true;
                notification.notify(
                  "info",
                  utils.getDisplayCopy("notifications", "saved_model"),
                  <Link href={func.data} isExternal>
                    {utils.getDisplayCopy("notifications", "open_model")} <Icon as={MdOpenInNew} mx="2px" />
                  </Link>
                );
              }
              break;
            default:
              break;
          }
        });
      }
      if (!already_open) notification.notify("info", utils.getDisplayCopy("notifications", "response_back"), data.response.msg);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/**
 *
 * @param {"SAP2000"} format
 */
const downloadInputTextFile = (format) => {
  let file_str = "";
  let structure = getState("structure");
  switch (format) {
    case "SAP2000":
      file_str = parsers.csi.getSAP2000Model(structure, "SAP2000", "25.1.0");
      break;
    default:
      alert("Unsupported file format: " + format);
      break;
  }
  file.downloadAnyFile("modelo_sap.$2k", "text", file_str, true);
};

const structure = { solveStructure, downloadInputTextFile };
export default structure;
