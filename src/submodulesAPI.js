import generateInputFile from "./submodules/paramele-parsers/structural/csi/generateInputFile";

const parsers = {
  csi: {
    getSAP2000Model: (s3d_model, version) => generateInputFile(s3d_model, "SAP2000", version),
  },
};
export { parsers };
