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
 * @requires module:JsonToUi - {@link module:JsonToUi | ./lib/JsonToUi.ts}
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
const { readFileSync } = require('fs'); // used for reading config file


// Custom Libraries
const DocsToJson = require('./lib/DocsToJson/index.ts');
const JsonToUi = require('./lib/JsonToUi/index.ts');


//-- Custom Utilities
const { DataManager } = require('./utils/DataManager.ts');
console.log('DataManager: ', DataManager)
const dm = new DataManager();

/**
 * @type {function} getArgs
 * @memberof module:build-docs
 * @access private
 * @async
 * @function getArgs
 * @summary Get cli args passed to the DocsToJson utility.
 * @description Used by the DocsToJson utility to parse args passed to the DocsToJson utility to customize run configuration via cli.
 * @returns {object} - Args object
 * @throws {error} - Error if args cannot be parsed.
 */
async function getArgs() {
  try {
    // eslint-disable-next-line no-undef
    const args = process.argv.slice(2);
    const argsMap = {};
    args.forEach((arg) => {
      const [key, value] = arg.split('=');
      argsMap[key] = value;
    });
    return argsMap;
  }
  catch (error) {
    console.error(error.message);
    console.error(error);
    throw new Error(`Error getting args. Error: ${error.message}`);
  }
}

/**
 * @type {function} getConfig
 * @memberof module:build-docs
 * @access private
 * @function getConfig
 * @summary Get DocsToJson default configuration.
 * @description Used by the DocsToJson utility to feed default configuration values. Args passed to the DocsToJson class will override these if valid.
 * @param {object} args - Args is an K/V Pair object of cli args passed in and being evaluated to update config.
 * @returns {object} - Config with updated values sent in as cli args, if any.
 * @throws {error} - Error if config cannot be parsed.
 * @todo Add validation of args.
 */
async function getConfig(args) {

  //TODO: 20230713 #EP || Add validation of args.
  console.log('args: ', args)

  try {
    //-- The configuration option to be returned
    const config = {
      init: {},
      out: {}
    };

    // 1. Get the config.json file path based on this files location.
    // eslint-disable-next-line no-undef
    const configPath = resolve(__dirname, 'config.json');

    // 2. Get the configuration, convert to JSON
    let defaults = readFileSync(configPath, 'utf8')
    defaults = JSON.parse(defaults);

    // 3. Get default options to prepare to be evaluated.
    defaults.settings.init.options.forEach((item) => {
      if (!item.title || !item.default) throw new Error(`Error getting config init options. Make sure config is setup with proper 'item' and 'default' configurations.`);
      config.init[item.title] = {
        ...item,
        value: item.default
      };
    });
    defaults.settings.out.options.forEach((item) => {
      if (!item.title || !item.default) throw new Error(`Error getting config output options. Make sure config is setup with proper 'item' and 'default' configurations.`);
      config.out[item.title] = {
        ...item,
        value: item.default
      };
    });
    //4. Return the config if no errors.
    return config;
  }
  catch (error) {
    console.error(error.message);
    console.error(error);
    throw new Error(`Error getting config. Error: ${error.message}`);
  }
}

/**
 * @type {function} getUpdatedConfig
 * @memberof module:build-docs
 * @access private
 * @async
 * @function getUpdatedConfig
 * @param {object} args - Args is an K/V Pair object of cli args passed in and being evaluated to update config.
 * @param {object} config - Config is the default configuration for the DocsToJson utility.
 * @returns {object} - Updated config with args passed in.
 */
async function getUpdatedConfig(args, config) {
  const updatedConfig = {
    ...config
  }

  // 1. Loop through args and overwrite  options accordingly.
  Object.keys(args).forEach((key) => {
    // TODO: 20230713 #EP || Add validation of args.

    //-- 1.1. Overwrite if the key exists in config.init.
    if (config.init[key]) {
      console.log('config.init[key] being overwritten: ', `key: '${key}'`, `old-value: '${config.init[key].value}', new-value: '${args[key]}'`)
      updatedConfig.init[key].value = args[key];
    }

    //-- 1.2. Overwrite if the key exists in config.out.
    if (config.out[key]) {
      console.log('config.out[key] being overwritten: ', `key: ${key}`, `old-value: '${config.out[key].value}', new-value: '${args[key]}'`)
      updatedConfig.out[key].value = args[key];
    }
  })
  // 2. Return the updated config.
  return updatedConfig;
}

/**
 * @type {function} run
 * @memberof module:build-docs
 * @access private
 * @async
 * @function run
 * @summary Run the DocsToJson utility and then JsonToUi libs.
 * @description Executes libraries to generate docs and then generate UI from docs using values within `updatedConfig` as reference for behaviors.
 * @param {object} [updatedConfig] - DocsToJson Configuration object with possible updates from cli args. Contains `init` and `out` objects.
 * @returns {object} results - Object containing the results. `success`, `message`, `getDocs`, and `saveDocs`.
 */
async function run(updatedConfig) {
  try {

    // 1. Deconstruct for readability.
    const { init, out } = updatedConfig;
    const { targetPath, targetPaths, targetFileTypes, ignoreFiles, targetFiles, ignorePaths } = init;
    const { outputPath } = out;

    const config_DocsToJson = {
      targetPath: targetPath.value,
      targetPaths: targetPaths.value,
      ignorePaths: ignorePaths.value,
      ignoreFiles: ignoreFiles.value,
      targetFiles: targetFiles.value,
      targetFileTypes: targetFileTypes.value,
      outputPath: outputPath.value,
    }

    // 2. Create instance of DocsToJson class with configuration options.
    //
    //  - Executing `DataManager.getObjectValues` to spread config_DocsToJson
    //    object into the DocsToJson. Keeping like this because will be getting
    //    the config info differently in the near future.
    const Build = new DocsToJson(
      ...dm.getObjectValues(config_DocsToJson)
    )


    // 3. Run the DocsToJson utility to generate docs for the rootPath, then save them to the outputPath.
    const docs = Build.generateDocs(targetPath.value);
    const saveDocsToJsonResults = Build.saveDocs(outputPath.value, docs);

    //TODO: Update to extract from updatedConfig once added to it and verified built in JsonToUi properly.
    const config_JsonToUi = {
      convertToMarkdown: true,
      convertToHtml: true,
    }

    // 4. Generate UI from generated docs
    const generateUiResults = new JsonToUi(docs, config_JsonToUi);

    // console.log('generateUiResults: ', generateUiResults)

    return {
      success: true,
      message: 'DocsToJson ran successfully.',
      Build,
      config: {
        DocsToJson: '',
        JsonToUi: config_JsonToUi
      },
      results: {
        DocsToJson: saveDocsToJsonResults,
        JsonToUi: generateUiResults
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
    // 1. Get Args
    const args = await getArgs();
    // console.log('args: ', args)

    // 2. Get Config
    const config = await getConfig(args);
    // console.log('config: ', config)

    // 3. Update Config with Args

    const updatedConfig = await getUpdatedConfig(args, config);
    // console.log('updatedConfig: ', updatedConfig)


    // 4. Run DocsToJson
    const runResults = await run(updatedConfig);
    // console.log('results: ')
    // console.log(runResults)
    // console.log('build-docs/index.main() passed: ', runResults.success);
    if (runResults.success == false) {
      throw new Error(runResults.message);
    }

    // 4. Returns runResults
    return runResults;
  }
  catch (error) {
    console.error(error);
    return {
      success: false,
      message: `ERROR: ${error}`,
    };
  }
}

main()
