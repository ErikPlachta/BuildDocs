/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @file index.js
 * @namespace {build-docs}
 * @module build-docs
 * @access public
 * @summary Entry point for the BuildDocsJson utility.
 * @description Executes the BuildDocsJson utility for target files types within a target path. The BuildDocsJson utility generates documentation for the target files and paths and saves the documentation to the target path.
 * @version 0.1.1
 * @since 0.1.0
 * @author Erik Plachta
 * @license MIT {@link https://opensource.org/licenses/MIT | License}
 * @argument {string} [rootDirectory] - `Required` Path to be parsed.
 * @argument {string} [targetFileTypes] - `Optional` File types to be parsed.
 * @argument {string[]} [targetPaths] -  `Optional` Paths within the targetPath to be parsed.
 * @argument {string[]} [ignoreFiles] - `Optional` Files to be ignored.
 * @argument {string[]} [targetFiles] - `Optional` Files to be parsed.
 * @argument {string[]} [ignorePaths] - `Optional` Paths to be ignored.
 *
 * 
 * @requires module:BuildDocsJson - {@link module:BuildDocsJson | ./BuildDocsJson.ts}
 * @requires module:JsonToDocs - {@link module:JsonToDocs | ./JsonToDocs.ts}
 * 
 * ### External Dependencies
 * 
 * @requires {@link https://nodejs.org/api/fs.html#fs_file_system | fs}
 * @requires {@link https://nodejs.org/api/path.html#path_path | path}
 * @requires {@link https://nodejs.org/api/child_process.html#child_process_child_process | child_process}
 * 
 */


// import foo = require('foo');
// require('foo');
// import foo from 'foo';



// Node/Javascript Utilities
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { process } = require('child_process'); // used for args
const { resolve, __dirname } = require('path'); // used for building results
const { readFileSync } = require('fs'); // used for reading config file


// Custom Utilities.
const BuildDocsJson = require('./lib/DocsToJson/index.ts');

/**
 * @type {function} getArgs
 * @memberof module:build-docs
 * @access private
 * @async
 * @function getArgs
 * @summary Get cli args passed to the BuildDocsJson utility.
 * @description Used by the BuildDocsJson utility to parse args passed to the BuildDocsJson utility to customize run configuration via cli.
 * @returns {object} - Args object
 * @throws {error} - Error if args cannot be parsed.
 */
async function getArgs() {
  try {
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
 * @summary Get BuildDocsJson default configuration.
 * @description Used by the BuildDocsJson utility to feed default configuration values. Args passed to the BuildDocsJson class will override these if valid.
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
 * @param {object} config - Config is the default configuration for the BuildDocsJson utility.
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
 * @summary Run the BuildDocsJson utility.
 * @description Run the BuildDocsJson utility.
 * @param {object} [updatedConfig] - BuildDocsJson Configuration object with possible updates from cli args. Contains `init` and `out` objects.
 * @returns {object} results - Object containing the results. `success`, `message`, `getDocs`, and `saveDocs`.
 */
async function run(updatedConfig) {
  try {

    // 1. Deconstruct for readability.
    const { init, out } = updatedConfig;
    const { targetPath, targetPaths, targetFileTypes, ignoreFiles, targetFiles, ignorePaths } = init;
    const { outputPath } = out;

    // 2. Create instance of BuildDocsJson class with configuration options.
    const Build = new BuildDocsJson(
      targetPath.value,
      targetPaths.value,
      ignorePaths.value,
      ignoreFiles.value,
      targetFiles.value,
      targetFileTypes.value,
      outputPath.value,
    );

    // 3. Run the BuildDocsJson utility to generate docs for the rootPath.
    const docs = Build.generateDocs(targetPath.value);
    const saveDocs = Build.saveDocs(outputPath.value, docs);

    return {
      success: true,
      message: 'BuildDocsJson ran successfully.',
      Build,
      // docs: docs,
      saveResults: saveDocs,
    };
  }
  catch (error) {
    // console.log(error);
    return {
      success: false,
      message: `Error running BuildDocsJson. Error: ${error.message}`,
      error: error
    };
  }
}


/**
 * @type {function} main
 * @access public
 * @async
 * @function main
 * @memberof module:BuildDocsJson
 * @summary Entry point for the BuildDocsJson utility.
 * @description Executes the BuildDocsJson utility for target files types within a target path. The BuildDocsJson utility generates documentation for the target files and paths and saves the documentation to the target path.
 * @returns {object} results - Object containing the results. `success`, `message`, `getDocs`, and `saveDocs`.
 * @throws {error} - Error if BuildDocsJson fails.
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


    // 4. Run BuildDocsJson
    const runResults = await run(updatedConfig);
    console.log('results: ')
    console.log(runResults)

    // 4. Returns runResults
    return runResults;
  }
  catch (error) {
    console.error(error.message);
    console.error(error);
    return {
      success: false,
      message: `Error running BuildDocsJson. Error: ${error.message}`,
    };
  }
}

main()
