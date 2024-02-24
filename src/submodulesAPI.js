import generateInputFile from "./submodules/paramele-parsers/structural/csi/generateInputFile";


const parsers = {
  csi: {
    getSAP2000Model: (s3d_model) => generateInputFile(s3d_model, "SAP2000", "25.1.0"),
  },
};
export { parsers };
