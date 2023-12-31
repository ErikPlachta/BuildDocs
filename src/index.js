/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @file build-docs\index.js
 * @namespace {build-docs}
 * @module build-docs
 * @access public
 * @summary Entry point for the build-docs utility.
 * @description Executes the build-docs utility for target files types within a target path. The DocsToJson utility generates documentation for the target files and paths and saves the documentation to the target path.
 * @version 0.1.2
 * @since 0.1.0
 * @author Erik Plachta
 * @license MIT {@link https://opensource.org/licenses/MIT | License}
 * 
 * @argument {string} [rootDirectory] - `Required` Path to be parsed.
 * @argument {string} [targetFileTypes] - `Optional` File types to be parsed.
 * @argument {string[]} [targetPaths] -  `Optional` Paths within the targetPath to be parsed.
 * @argument {string[]} [ignoreFiles] - `Optional` Files to be ignored.
 * @argument {string[]} [targetFiles] - `Optional` Files to be parsed.
 * @argument {string[]} [ignorePaths] - `Optional` Paths to be ignored.
 *
 * 
 * @requires module:DocsToJson - {@link module:DocsToJson | ./lib/DocsToJson.ts}
 * @requires module:DocsToUi - {@link module:DocsToUi | ./lib/DocsToUi.ts}
 * @requires {@link https://nodejs.org/api/fs.html#fs_file_system | fs}
 * @requires {@link https://nodejs.org/api/path.html#path_path | path}
 * @requires {@link https://nodejs.org/api/child_process.html#child_process_child_process | child_process}
 * 
 * @changelog 0.1.0 | 2023-07-01 | Erik Plachta | Built concept
 * @changelog 0.1.1 | 2023-07-14 | Erik Plachta | Updated data-extraction to include more complete data.
 * @changelog 0.1.2 | 2023-07-15 | Erik Plachta | Onboard to generate docs.json and then build the UI content.
 */

// Node/Javascript Utilities
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { spawn } = require('child_process'); // used for args
const { resolve } = require('path'); // used for building results
const { readFileSync, writeFileSync } = require('fs'); // used for reading config file

// Custom Libraries
const Config_Class = require('./lib/Config/index.ts');
const DocsToJson_Class = require('./lib/DocsToJson/index.ts');
const DocsToUi_Class = require('./lib/DocsToUi/index.ts');


//-- Custom Utilities
const { DataManager } = require('./utils/DataManager.ts');


//------------------------------------------------------------------------------
//-- Functions


/**
 * @function run
 * @type {function} run
 * @memberof module:build-docs
 * @access private
 * @async
 * @summary Run the DocsToJson utility and then DocsToUi libs.
 * @description Executes libraries to generate docs and then generate UI from docs using values within `updatedConfig` as reference for behaviors.
 * @param {object} [settings] - DocsToJson Configuration object with possible updates from cli args. Contains `init` and `out` objects.
 * @returns {object} results - Object containing the results. `success`, `message`, `getDocs`, and `saveDocs`.
 */
async function run(config) {
  //  Using `dm` for converting k/v pair object to array of values.
  const dm = new DataManager();

  // TESTING
  // settings.forEach((setting) => {
  //   setting.options.forEach((option) => {
  //     console.log(`option: \t - ${option.title}: ${option.value}`)
  //   })
  // })

  try {
    // 1. Deconstruct for readability. 
    const { DocsToJson, DocsToUi, Logging, Target, Output } = config;

    //TODO: Use logging options to manage behavior once concept is built.
    const loggingLevel = Logging.options.filter((option) => option.title.toLowerCase() == 'level')?.[0]?.value || 3;
    const [targetPath, targetPaths, targetFileTypes, ignoreFiles, targetFiles, ignorePaths] = Target.options;
    const [outputPath, outputName ] = Output.options;

    // 2. Build config object for DocsToJson.
    const config_DocsToJson = {
      targetPath: targetPath?.value,
      targetPaths: targetPaths?.value,
      ignorePaths: ignorePaths?.value,
      ignoreFiles: ignoreFiles?.value,
      targetFiles: targetFiles?.value,
      targetFileTypes: targetFileTypes?.value,
      outputPath: outputPath?.value
    }

    // console.log('config_DocsToJson: ', config_DocsToJson)
    // console.log('loggingLevel: ', loggingLevel)


    // 2. Create instance of DocsToJson class with configuration options.
    const d2json = new DocsToJson_Class(...dm.getObjectValuesAsArray(config_DocsToJson))


    // 3. Run the DocsToJson utility to generate docs for the rootPath, then save them to the outputPath.
    const docs = d2json.generateDocs(targetPath.value);
    const saveDocsJson = d2json.saveDocs(outputPath.value, docs);



    //-----------------------------------
    // DocsToUi



    // 4. Generate UI from generated docs
    //TODO: Update to extract from updatedConfig once added to it and verified built in DocsToUi properly.
    // const DocsToUiOptions = Output.options.filter((option) => option.memberOf != 'module:build-docs.DocsToUi');
    const config_DocsToUi = {
      convertToMarkdown: true,
      convertToHtml: true,
    }
    const d2ui = new DocsToUi_Class(loggingLevel, docs, config_DocsToUi);
    // console.log('DocsToUi: ', DocsToUi)
    const d2Html = await d2ui.getHtml();
    const d2md = d2ui.getMarkdown();
    
    

    //5. Write the files to the output path.
    writeFileSync(resolve(outputPath.value, `${outputName.value}.html`), d2Html);



    // console.log('DocsToUi: ', DocsToUi)

    return {
      success: true,
      message: 'DocsToJson ran successfully.',
      results: {
        DocsToJson: {
          config: config_DocsToJson,
          json: d2json,
          saveResponse: saveDocsJson,
        },
        DocsToUi: {
          config: config_DocsToUi,
          buildResponse: d2ui,
          htmlResponse: d2Html,
          markdownResponse : d2md
        }
      }
    };
  }
  catch (error) {
    // console.log(error);
    return {
      success: false,
      message: `Error running DocsToJson. Error: ${error.message}`,
      error: error
    };
  }
}


/**
 * @access public
 * @async
 * @type {function} main - Entry point for the build-docs utility.
 * @function main
 * @memberof module:build-docs
 * @summary Entry point for the build-docs utility.
 * @description Executes the build-docs utility. Takes a config to target specific path(s) and file(s). Extracts comment blocks and generates a JSON file with the extracted data. Then generates an HTML or Markdown file with the extracted data.
 * @returns {object} results - Object containing the results. `success`, `message`, `getDocs`, and `saveDocs`.
 * @throws {error} - Error if build-docs fails.
*/
async function main() {
  try {

    // 1. Handle the configuration options.
    const config = await new Config_Class().run();
    const { success, message, data } = config;
    if (!success) throw new Error(config);

    // console.log(data.config)


    //  2. Run the build-docs utility with settings.
    const runResults = await run(data.config);

    // // 6.If failed to run module properly, throw error.
    if (runResults.success == false) {
      // if (LoggingLevel > 0)  // TODO: get logginglevel from settings.
      console.error(runResults)
      throw new Error(runResults.message)
    };



    // 7. Otherwise successful execution.
    return {
      success: true,
      message: 'SUCCESS: Execution of build-docs module complete.',
      results: 'runResults'
    }
  }
  catch (error) {
    console.error(error);
    return {
      success: false,
      message: `ERROR: Execution of build-docs module failed.`,
      results: error
    };
  }
}

main()

// TODO: Create string of config for logging purposes to be saved.
// const configString = JSON.stringify(config, null, 2);