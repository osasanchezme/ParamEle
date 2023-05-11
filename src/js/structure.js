import notification from "../components/notification";
import getState from "../getState";

const solveStructure = () => {
  let structure = getState("structure");
//   let file_name = Date.now();
  let file_name = "my_model_" + Date.now();
  let api_object = {
    auth: {
      username: "oscar.sanchez@skyciv.com",
      key: "1zQdtsDoca671lIvToi5laZjMWnc33UrBQZL5YYeagvn8fPRRMQwmEVubyIguj88",
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
      if (data.functions) {
        data.functions.forEach((func) => {
          if (func.function === "S3D.file.save") {
            if (!already_open) {
              already_open = true;
              notification.closeAllNotifications();
              notification.notify("info", "saved_model", "", true);
              setTimeout(() => {
                window.open(func.data, "_blank");
              }, 2000);
            }
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const structure = { solveStructure };
export default structure;
