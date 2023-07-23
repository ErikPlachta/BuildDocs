/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @file JsonToUi\JsonToUi.test.ts
 * @namespace {build-docs.JsonToUi.Test}
 * @memberof namespace:build-docs.JsonToUi
 * @module JsonToUi.Test
 * @description Executes a test of the JsonToUi class.
 * @requires module:build-docs.JsonToUi
 * @requires module:build-docs.types
 * @requires module:fs
 */

// import { resolve } from 'path'
import { Comments } from '../types'
const JsonToUi = require('./index.ts')
const { writeFileSync } = require('fs')
const rootPath  = process.cwd();
const data = require(`${rootPath}/.dist/docs.json`)
const configPath = `${rootPath}/.dist/JsonToUi`

/**
 * @type {function} main
 * @function main
 * @memberof module:JsonToUi.Test
 * @summary Executed on run. Engages testing on JsonToUi class with some hard-coded params.
 * @param {Comments[]} comments - Array of comment blocks converted to object.
 * @returns {boolean} - Returns true if successful, otherwise false.
 */
function main(comments: Comments[]) {
    try {
        //-- if Folder doesn't exist, create it.
        if (!require('fs').existsSync(configPath)) {
            require('fs').mkdirSync(configPath)
        }
        
        //-- Then execute JsonToUi Class
        const run = new JsonToUi(comments)

        //-- Then write all files to config path for debugging.
        writeFileSync(
            `${configPath}/sourceData.json`,
            JSON.stringify(run.elements, null, 2)
        )
        writeFileSync(
            `${configPath}/processedData.json`,
            JSON.stringify(run.processedData, null, 2)
        )
        writeFileSync(
            `${configPath}/modules.json`,
            JSON.stringify(run.modules, null, 2)
        )
        writeFileSync(
            `${configPath}/namespaces.json`,
            JSON.stringify(run.namespaces, null, 2)
        )
        writeFileSync(
            `${configPath}/files.json`,
            JSON.stringify(run.files, null, 2)
        )
        writeFileSync(
            `${configPath}/contentGroups.json`,
            JSON.stringify(run.contentGroups, null, 2)
        )

        writeFileSync(
            `${configPath}/elements.json`,
            JSON.stringify(run.elements, null, 2)
        )

        // // writeFileSync('test.md', markdown);
        // // writeFileSync('test.html', html);
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

main(data)
