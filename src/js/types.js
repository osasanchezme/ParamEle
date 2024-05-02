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
 * @property {"equal_key"|"no"|"contains"|"custom_function"} type
 * @property {string} criteria String against which to apply the validation type
 * @property {string} msg Key of the message in the copies to display
 */

/**
 * @typedef {Object} ParamEleFileData
 * @property {string} file_name,
 * @property {boolean} is_saved,
 * @property {number} last_saved,
 * @property {string} model_id,
 * @property {string[]} file_path File path including "home" in the first position,
 * @property {number} current_version
 * @property {string} file_owner_path
 * @property {boolean} file_shared_with_me
 * @property {ParamEleFileHistory} file_history
 * @property {Object.<string, {date: number, path: string, role: ParamEleUserRole}>} file_shared_data
 */

/**
 * @callback ParamEleSetFileDataCallback
 * @param {ParamEleFileData} file_data
 */

/**
 * @callback ParamEleGetFileDataCallback
 * @returns {ParamEleFileData}
 */

/**
 * @typedef {Object} ParamEleFireBaseProjectData
 * @property {number} created
 * @property {number} current_version
 * @property {ParamEleFileHistory} history
 * @property {string} id Model ID
 * @property {ParamEleUserRole} role
 * @property {ParamEleFileSharedData} shared
 */

/**
 * @typedef {Object} ParamEleFireBaseSharedProjectData
 * @property {string} id Model ID
 * @property {string} owner User ID of the file owner
 * @property {string} path Full path in the database to the actual project data
 */

/**
 * @typedef {Object} ParamEleFireBaseCompleteSharedProjectData
 * @property {number} created
 * @property {number} current_version
 * @property {ParamEleFileHistory} history
 * @property {string} id Model ID
 * @property {ParamEleUserRole} role
 * @property {ParamEleFileSharedData} shared
 * @property {string} owner User ID of the file owner
 * @property {string} path Full path in the database to the actual project data
 * @property {boolean} is_shared_with_me Whether or not this file is shared with me
 */

/**
 * @typedef {Object.<number, ParamEleFileVersionItem>} ParamEleFileHistory
 */

/**
 * @typedef {{commit_msg: string, num_nodes: number, results_available: boolean, author: string}} ParamEleFileVersionItem
 */

/**
 * @description Basic object with contact information
 * @typedef {{email: string, username: string}} ParamEleContact
 */

/**
 * @description Object with the data for all the contacts with the model shared
 * @typedef {Object.<string,ParamEleFileSharedSubData>} ParamEleFileSharedData
 */

/**
 * @description Object with the sharing data for one contact
 * @typedef {{date: number, path: string, role: ParamEleUserRole}} ParamEleFileSharedSubData
 */

/**
 * @callback ParamEleContactHandlerCallback
 * @param {ParamEleContact} contact
 */

/**
 * @callback ParamEleFireBaseProjectDataCallback
 * @param {ParamEleFireBaseCompleteSharedProjectData} project_data
 */

/**
 * @typedef {'owner'|'admin'|'editor'} ParamEleUserRole
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
