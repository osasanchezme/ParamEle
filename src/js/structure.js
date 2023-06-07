import notification from "../components/notification";
import getState from "../getState";
import state from "../state";
import utils from "../utils";
import { Link, Icon } from "@chakra-ui/react";
import { MdOpenInNew } from "react-icons/md";

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
            case "S3D.session.solve":
              state.setState(func.data, "results");
              notification.notify("info", "results_saved", null, true);
              break;
            case "S3D.session.save":
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

const structure = { solveStructure };
export default structure;
