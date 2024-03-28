/**
 *
 * @param {import("./types").ParamEleProcessStatus} status
 * @param {string} msg
 * @param {any} data
 * @returns {import("./types").ParamEleProcessResponse}
 */
const getProcessResponseObject = (status, msg, data) => {
  return {
    status,
    msg,
    data,
    success: status == "success",
  };
};

export { getProcessResponseObject };
