/**
 * @typedef {object} ParamEleProcessResponse
 * @property {ParamEleProcessStatus} status
 * @property {string} msg Message itself of a key to look in the copies
 * @property {any} data
 * @property {boolean} success
 */

/**
 * @typedef {'success'|'error'} ParamEleProcessStatus
 */

/**
 * @typedef {object} ParamEleFormField
 * @property {string} value
 * @property {boolean} valid
 * @property {error_msg} string
 */

/**
 * @typedef {object} ParamEleDefaultFormField Object with the needed data to create a proper ParamEleForm and use it to validate and everything
 * @property {String} default Default value
 * @property {"text"|"email"|"dropdown"|"password"} type Type of the field
 * @property {Array.<ParamEleFormValidationObject>} validation
 * @property {Boolean} is_first_field
 */

/**
 * @typedef {Object} ParamEleFormValidationObject
 * @property {"equal_key"|"no"|"contains"} type
 * @property {string} criteria String against which to apply the validation type
 * @property {string} msg Key of the message in the copies to display
 */

/**
 * @typedef {Object.<string, ParamEleFormField>} ParamEleFormStateObject
 */

/**
 * @typedef {Object.<string, ParamEleDefaultFormField>} ParamEleFormDefaultStateObject
 */

/**
 * @callback ParamEleProcessResponseHandlerCallback
 * @param {ParamEleProcessResponse} response_object
 */

exports.unused = {};
