import generateInputFileESM from "./submodules/paramele-parsers/structural/csi/generateInputFileESM";


const parsers = {
  csi: {
    getSAP2000Model: (s3d_model) => generateInputFileESM(s3d_model, "SAP2000", "25.1.0"),
  },
};
export { parsers };
