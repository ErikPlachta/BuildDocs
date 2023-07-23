/**
 * @file onSave_Manager.js
 * @type {module:onSave.Manager}
 * @namespace onSave
 * @module onSave.Manager
 * @requires module:onSave.GetData
 * @description This module is the entry point for the onSave event. It calls the onSave_SetData module and returns the response.
 * @fires onSave_SetData
 */

import onSave_SetData from '../../onSave_setData';

/**
 * @function main
 * @type {function} main
 * @memberof module:onSave.Manager
 * @returns {object} - onSave_GetData response.
 * @description This module is the entry point for the onSave event. It calls the onSave_SetData module and returns the response.
 * @fires onSave_SetData
 */
function main() {
  return onSave_SetData()

}

main()