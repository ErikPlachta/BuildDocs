/**
 * @file OnLoad_Manager.js
 * @type {file} onLoad_Manager.js
 * @namespace onLoad
 * @module onLoad.Manager
 * @requires module:onLoad.GetData
 * @description This module is the entry point for the OnLoad event. It calls the OnLoad_GetData module and returns the response.
 * @fires onLoad_GetData
 */

import onLoad_GetData from '../../onLoad_GetData';

/**
 * @function main
 * @type {function} main
 * @memberof module:onLoad.Manager
 * @returns {object} - OnLoad_GetData response.
 * @description This module is the entry point for the OnLoad event. It calls the OnLoad_GetData module and returns the response.
 * 
 */
function main() {
  return onLoad_GetData()

}

main()