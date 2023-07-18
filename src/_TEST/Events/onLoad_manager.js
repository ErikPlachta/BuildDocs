/**
 * @file OnLoad_Manager.js
 * @namespace OnLoad
 * @module OnLoad.Manager
 * @requires module:OnLoad.GetData
 */


import OnLoad_GetData from '../OnLoad_GetData';
// const OnLoad_GetData = requires('../OnLoad_GetData')

/**
 * @function main
 * @type {function} main
 * @memberof module:OnLoad.Manager
 * @returns {object} - OnLoad_GetData response.
 */
function main() {
  return OnLoad_GetData()

}

return main()