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
const { readFileSync, writeFileSync } = require('fs'); // used for reading config file

// Custom Libraries
const DocsToJson = require('./lib/DocsToJson/index.ts');
const JsonToUi = require('./lib/JsonToUi/index.ts');


//-- Custom Utilities
const { DataManager } = require('./utils/DataManager.ts');
const { emitWarning } = require('process');
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
 * @returns {object} - success (boolean), message (string), and data (object) containing the args passed in.
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
    return {
      success: true,
      message: `SUCCESS: Args loaded successfully.`,
      data: argsMap
    };
  }
  catch (error) {
    return {
      success: false,
      message: `ERROR: Failed to process args: ${error.message}`,
      data: error
    }
  }
}

/**
 * @type {function} getConfig
 * @memberof module:build-docs
 * @access private
 * @function getConfig
 * @summary Get DocsToJson default configuration.
 * @description Used by the DocsToJson utility to feed default configuration values. Args passed to the DocsToJson class will override these if valid.
 * @returns {object} - Verified Config object.
 * @throws {error} - Error if config cannot be parsed.
 * @todo Add validation of args.
 */
async function getConfig() {
  const verifiedConfig = {}; // The configuration option to be returned
  const supportedConfig = ['Logging', 'Output', 'Target'] // Config options that are supported.
  const unsupportedSettings = [] // holds any config options that are not supported.
  try {


    // 1. Get the configuration, convert to JSON
    const config = resolve(__dirname, 'config.ts'); // Import transpiled JavaScript file
    const settings = config.settings;
    // const configPath = resolve(__dirname, 'config.json');

    // 2. Create string of config for logging purposes.
    const configString = JSON.stringify(config, null, 2);

    // let config = readFileSync(configPath, 'utf8')
    // config = JSON.parse(config);

    // 3. Check for any unsupported config.settings group(s):
    supportedConfig.forEach((setting) => {
      // console.log('setting: ', setting, 'settings: ', settings[setting])
      if (!settings[setting]) unsupportedSettings.push(setting);
    })
    // Log any unsupported config.settings group(s) for awareness
    if (unsupportedSettings.length > 0) console.error(`The following config options within settings are unsupported: ${unsupportedSettings.join(', ')}`);


    // 4. Get default options to prepare to be evaluated by looping through all settings.




    // The logging options
    // config.settings.Logging.options.forEach((item) => {
    //   if (!item.title || !item.default) throw new Error(`Error getting config logging options. Make sure config is setup with proper 'item' and 'default' configurations.`);
    //   // console.log('item: ', item)

    //   verifiedConfig.Logging[item.title] = {
    //     ...item,
    //     value: item.default
    //   };
    // })

    // // The init options
    // config.settings.Target.options.forEach((item) => {
    //   if (!item.title || !item.default) throw new Error(`Error getting config init options. Make sure config is setup with proper 'item' and 'default' configurations.`);
    //   verifiedConfig.Target[item.title] = {
    //     ...item,
    //     value: item.default
    //   };
    // });

    // // The output options
    // config.settings.out.options.forEach((item) => {
    //   if (!item.title || !item.default) throw new Error(`Error getting config output options. Make sure config is setup with proper 'item' and 'default' configurations.`);
    //   verifiedConfig.out[item.title] = {
    //     ...item,
    //     value: item.default[0].value
    //   };
    // });
    //4. Return the config if no errors.
    return {
      success: true,
      message: `SUCCESS: Config loaded successfully.`,
      data: verifiedConfig
    }
  }
  catch (error) {
    return {
      success: false,
      message: `ERROR: Failed to process config: ${error.message}`,
      data: error
    }
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
 * @returns {object} - success (boolean), message (string), and data (object) containing the updated config.
 * @todo: Add logic to strip `--` prefaced to args if any just in case.
 */
async function getUpdatedConfig(args, config) {
  try {
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
    return {
      success: true,
      message: `SUCCESS: Updated config with args successfully.`,
      data: updatedConfig
    };
  }
  catch (error) {
    return {
      success: false,
      message: `ERROR: Failed to update config with args: ${error.message}`,
      data: error
    }
  }
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
    const { init, out, logging } = updatedConfig;
    // const { logLevel, logToConsole, logToFile, logFileWriteMode  } = logging;
    console.log('logging: ', logging)
    // console.log( 'logging:'
    //   `\n\t - logLevel: ${logLevel}`,
    //   `\n\t - logToConsole: ${logToConsole}`,
    //   `\n\t - logToFile: ${logToFile}`,
    //   `\n\t - logFileWriteMode: ${logFileWriteMode}`  
    // )
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
    const generateUiResults = new JsonToUi(true, docs, config_JsonToUi);

    const htmlDocument = generateUiResults.getHtml();
    // const markdownDocument = generateUiResults.getMarkdown();

    writeFileSync(resolve(outputPath.value, 'index.html'), htmlDocument);

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
  let LoggingLevel = 5; // Default to info until pulled from config.
  try {

    // 1. Get Config - The default config values.
    const config = await getConfig();
    if (config.success == false && LoggingLevel > 0) {
      console.error(config)
      throw new Error(JSON.stringify(config))
    }
    console.log('config: ', config)

    // 2. Set the logging level 
    LoggingLevel = config.data.Logging.logLevel.value;
    console.log('LoggingLevel: ', LoggingLevel)


    // 3. Get Args - The cli args passed in.
    const args = await getArgs();
    // failed, warning but can still continue
    if (args.success == false && LoggingLevel > 1) {
      console.warn(args)
    }

    // 4. Update Config with Args  - Overwrite the default config values with any matching args passed in.
    const updatedConfig = await getUpdatedConfig(args.data, config.data);
    if (updatedConfig.success == false) {
      if (LoggingLevel > 0) console.error(updatedConfig)
      throw new Error(updatedConfig)
    }

    // 5. Execute build-docs module with updatedConfig .
    // const runResults = await run(updatedConfig.data);

    // 6.If failed to run module properly, throw error.
    if (runResults.success == false) {
      if (LoggingLevel > 0) console.error(runResults)
      throw new Error(runResults.message)
    };



    // 7. Otherwise successful execution.
    return {
      success: true,
      message: 'SUCCESS: Execution of build-docs module complete.',
      results: runResults
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
