// Node/Javascript Utilities
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { spawn } = require('child_process') // used for args
const { resolve } = require('path') // used for building results
const { readFileSync, writeFileSync } = require('fs') // used for reading config file

import { randomUUID } from 'crypto'
import { Config, Logging, Setting, Option, ErrorRecord } from '../types'

type results = {
  success: boolean
  message: string
  data: any
  errors?: []
}

/**
 * @module HandleConfig
 * @class HandleConfig
 * @description HandleConfig is a class that handles the configuration options for the DocsToJson utility.
 * @summary Handles the configuration options for the build-docs utility.
 * @memberof module:build-docs
 * @access private
 * @version 0.0.2
 * @author Erik Plachta
 * @since 2021-07-22
 *
 * @changelog  0.0.1 | 2023-07-22 | Erik Plachta | Extracted from root index.js.
 * @changelog  0.0.2 | 2023-07-22 | Erik Plachta | Rebuilt into a class that is managing the Config.
 */
class Configure {
  public defaults: Config // The default configuration options.
  public LoggingLevel: Logging['option']['level']['value']
  public config: any
  public args: any
  public unsupportedSettings: any
  public errors: ErrorRecord[] = []

  constructor() {
    // this.defaults = config
    this.LoggingLevel = 5
    this.config = {}
    this.args = {}
    this.unsupportedSettings = []
    this.errors = []

    this.defaults = {
      title: 'config',
      namespace: 'build-docs',
      version: '0.1.4',
      author: 'Erik Plachta',
      summary: 'Options used by `build-docs` to determine run behavior.',
      description:
        'Config options used by `build-docs` to control the overall operations and behavior of the module. This includes the ability to enable/disable features, and set default values.',
      settings: [
        {
          title: 'Logging',
          summary: 'Settings for logging behavior.',
          description: 'How build-docs should handle logging, including output location and level.',
          options: [
            {
              title: 'level',
              description:
                'The level of logging to output to file and/or console depending on config. 0 = None, 1 = Fatal, 2 = Error, 3 = Warn, 4 = Debug, 5 = Info.',
              type: 'string',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Info',
                  description: 'Log all info, debug, warn, error, and fatal messages.',
                  value: 5,
                },
              ],
              supported: [
                {
                  title: 'Info',
                  description: 'Log all info, debug, warn, error, and fatal messages.',
                  value: 5,
                },
                {
                  title: 'Debug',
                  description: 'Log all debug, warn, error, and fatal messages.',
                  value: 4,
                },
                {
                  title: 'Warn',
                  description: 'Log all warn, error, and fatal messages.',
                  value: 3,
                },
                {
                  title: 'Error',
                  description: 'Log all error, and fatal messages.',
                  value: 2,
                },
                {
                  title: 'Fatal',
                  description: 'Log only fatal messages.',
                  value: 1,
                },
                {
                  title: 'None',
                  description: 'Log only fatal messages.',
                  value: 0,
                },
              ],
              memberOf: 'build-docs',
              dependentOn: ['settings/logging/options/logToFile', 'settings/logging/options/logToConsole'],
            },
            {
              title: 'toConsole',
              description: 'Should build-docs print logging to console.',
              type: 'boolean',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Enabled',
                  description: 'Enable logging to console.',
                  value: true,
                },
              ],
              supported: [
                {
                  title: 'Enabled',
                  description: 'Enable logging to console.',
                  value: true,
                },
                {
                  title: 'Disabled',
                  description: 'Disable logging to console.',
                  value: false,
                },
              ],
              memberOf: 'build-docs',
              dependentOn: ['settings/logging/options/logLevel'],
            },
            {
              title: 'toFile',
              description: 'Enable or disable logging to a file.',
              type: 'boolean',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Enabled',
                  description: 'Enable logging to a file.',
                  value: true,
                },
              ],
              memberOf: 'build-docs',
            },
            {
              title: 'filePath',
              description: 'Where to write log file(s).',
              type: 'string',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Logs',
                  description: 'Save results in build-docs target output path `/logs`.',
                  value: 'logs',
                },
              ],
            },
            {
              title: 'fileName',
              description: 'Name of the log file(s).',
              type: 'string',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Date-Time-Long',
                  description: 'The date and time the log file was created.',
                  value: 'YYYY-DD-MM-HH:MM:SS:ms',
                },
              ],
              supported: [
                //TODO: Update these to populate dynamically.
                {
                  title: 'Date-Time-Long',
                  description: 'The date and time the log file was created.',
                  value: 'YYYY-DD-MM-HH:MM:SS:ms',
                },
                {
                  title: 'Date-Time-Short',
                  description: 'The date and time the log file was created.',
                  value: 'YYYY-DD-MM-HH:MM:SS',
                },
                {
                  title: 'Date-Long',
                  description: 'The date the log file was created.',
                  value: 'YYYY-DD-MM',
                },
                {
                  title: 'Date-Short',
                  description: 'The date the log file was created.',
                  value: 'YYYY-DD',
                },
                {
                  title: 'Time-Long',
                  description: 'The time the log file was created.',
                  value: 'HH:MM:SS:ms',
                },
                {
                  title: 'Time-Short',
                  description: 'The time the log file was created.',
                  value: 'HH:MM:SS',
                },
                {
                  title: 'Target Root + Date-Time-Long',
                  description: 'The target root path and date and time the log file was created.',
                  value: 'targetRoot/YYYY-DD-MM-HH:MM:SS:ms',
                },
              ],
            },
            {
              title: 'fileFormat',
              description: 'Output format to be used for build-docs.',
              type: 'string[]',
              required: true,
              enabled: true,
              value: null,
              memberOf: 'build-docs', // TODO: verify this.
              default: [
                {
                  title: 'JSON',
                  description: 'Save log file(s) in JSON format.',
                  value: 'json',
                },
              ],
              // "json", "txt"
              supported: [
                {
                  title: 'JSON',
                  description: 'Save log file(s) in JSON format.',
                  value: 'json',
                },
                {
                  title: 'Text',
                  description: 'Save log file(s) in text format.',
                  value: 'txt',
                },
              ],
            },
            {
              title: 'fileWriteMode',
              description: 'If a file already exists behavior, and option to make unique.',
              type: 'string',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Overwrite',
                  description:
                    'Opens file for overwrite and replaces all existing content. The file is created if it does not exist.',
                  value: 'overwrite',
                },
              ],
              // "overwrite", "append", "prepend", "new"
              supported: [
                {
                  title: 'Overwrite',
                  description: 'Opens file for overwrite. The file is created if it does not exist.',
                  value: 'overwrite',
                },
                {
                  title: 'Append',
                  description: 'Opens file for appending. The file is created if it does not exist.',
                  value: 'append',
                },
                {
                  title: 'Prepend',
                  description: 'Opens file for prepending. The file is created if it does not exist.',
                  value: 'prepend',
                },
                {
                  title: 'New',
                  description: 'Always builds a a new file with a unique id of date-time.',
                  value: 'new',
                },
              ],
              reference: 'https://nodejs.dev/en/api/v20/fs/#file-system-flags',
            },
          ],
        },
        {
          title: 'Output',
          summary: 'Config options build-docs output behavior.',
          description:
            'Options for where build-docs will generate the results, the filename, and what format to generate them in.',
          options: [
            {
              title: 'outputPath',
              description:
                'Output options to be used build-docs. Default is the root of where it was executed from `.dist`.',
              type: 'string',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Current Directory `/.dist`',
                  description: 'The current directory where build-docs was executed from.',
                  value: './.dist',
                },
              ],
            },
            {
              title: 'outputName',
              description: 'Output name to be used for build-docs.',
              type: 'string',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Target Root Directory_comments',
                  description: 'The name of the output file.',
                  value: 'TARGET_ROOT_DIRECTORY_comments',
                },
              ],
              supported: [
                {
                  title: 'Target Root Directory_comments',
                  description: 'The name of the output file.',
                  value: 'TARGET_ROOT_DIRECTORY_comments',
                },
              ],
            },
            {
              title: 'outputFormat',
              description: 'Output format to be used for build-docs.',
              type: 'string[]',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'JSON',
                  description: 'Save results in JSON format.',
                  value: 'json',
                },
              ],
              supported: [
                {
                  title: 'JSON',
                  description: 'Save results in JSON format.',
                  value: 'json',
                },
                {
                  title: 'Markdown',
                  description: 'Save results in Markdown format.',
                  value: 'md',
                },
                {
                  title: 'HTML',
                  description: 'Save results in HTML format.',
                  value: 'html',
                },
              ],
            },
            {
              title: 'writeMode',
              description: 'If a file already exists behavior, and option to make unique.',
              type: 'string',
              required: false,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Overwrite',
                  value: 'overwrite',
                  description:
                    'Opens file for overwrite and replaces all existing content. The file is created if it does not exist.',
                },
              ],
              reference: 'https://nodejs.dev/en/api/v20/fs/#file-system-flags',
              memberOf: 'build-docs.generateDocs',
              supported: [
                {
                  title: 'Overwrite',
                  description: 'Opens file for overwrite. The file is created if it does not exist.',
                  value: 'overwrite',
                },
                {
                  title: 'Append',
                  description: 'Opens file for appending. The file is created if it does not exist.',
                  value: 'append',
                },
                {
                  title: 'Prepend',
                  description: 'Opens file for prepending. The file is created if it does not exist.',
                  value: 'prepend',
                },
                {
                  title: 'New',
                  description: 'Always builds a a new file with a unique id of date-time.',
                  value: 'new',
                },
              ],
            },
          ],
        },
        {
          title: 'Target',
          summary: 'Where to look and the type of files to should be looking for docs.',
          description:
            'Manage the location(s) to search within, location(s) to ignore, file types to look for, and file types to ignore.',
          options: [
            {
              title: 'root',
              description: 'The root directory to search for documentation within by build-docs.',
              type: 'string',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Current Directory',
                  description: 'The current directory where build-docs was executed from.',
                  value: './',
                },
              ],
              memberOf: 'build-docs.generateDocs',
            },
            {
              title: 'targetPaths',
              description: 'Optional Paths to be used for build-docs. (not yet built out)',
              type: 'string[]',
              required: false,
              enabled: false,
              value: null,
              default: [],
            },
            {
              title: 'targetFileTypes',
              description: 'The file types to extract build documentation from.',
              type: 'string[]',
              required: true,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'JavaScript',
                  description: 'Look for docs within JavaScript files',
                  value: 'js',
                },
                {
                  title: 'TypeScript',
                  description: 'Look for docs within TypeScript files',
                  value: 'ts',
                },
              ],
              supported: [
                {
                  title: 'JavaScript',
                  description: 'Look for docs within JavaScript files',
                  value: 'js',
                },
                {
                  title: 'TypeScript',
                  description: 'Look for docs within TypeScript files',
                  value: 'ts',
                },
              ],
            },
            {
              title: 'ignoreFiles',
              description: 'Files to ignore when building documentation.',
              type: 'string[]',
              required: false,
              enabled: false,
              value: null,
              default: [],
            },
            {
              title: 'targetFiles',
              description: 'Array of specific files to target',
              type: 'string[]',
              required: false,
              enabled: false,
              value: null,
              default: [],
            },
            {
              title: 'ignorePaths',
              description: 'Paths to ignore when building documentation.',
              type: 'string[]',
              required: false,
              enabled: true,
              value: null,
              default: [
                {
                  title: 'Node Modules',
                  description: 'Ignore node_modules directory',
                  value: 'node_modules',
                },
                {
                  title: 'Archive',
                  description: 'Ignore _ARCHIVE directory anywhere within target root path.',
                  value: '_ARCHIVE',
                },
                {
                  title: 'Thunder Client',
                  description: 'Ignore _thunder-client, a VS Code extension, directory.',
                  value: '_thunder-client',
                },
                {
                  title: 'VS Code',
                  description: 'Ignore .vscode directory anywhere within target root path.',
                  value: '.vscode',
                },
                {
                  title: 'Build Docs',
                  description: 'Ignore build-docs_v1 directory anywhere within target root path.',
                  value: 'build-docs_v1',
                },
              ],
            },
          ],
        },
      ],
    }

    //----------------------------
    // Executes on instantiation.
    this.__init__()
      .then((results: results) => {
        if (results.success == false) {
          console.error(results)
          throw new Error(JSON.stringify(results))
        }
      })
      .catch((error: Error) => {
        if (this.LoggingLevel > 0) console.error(error)
        let err = {
          success: false,
          message: `ERROR: Failed to process config: ${error.message}`,
          data: {
            config: this.config,
            unsupportedSetting: this.unsupportedSettings,
            args: this.args,
            error,
          },
        }
      })
  }

  /**
   * @function __init__
   * @type {function} __init__
   * @memberof module:build-docs
   * @access public
   * @async
   * @summary Runs the configuration process for the DocsToJson utility.
   * @description Runs the configuration process for the DocsToJson utility. This includes getting the config, getting the args, and updating the config with the args.
   *
   */
  async __init__(): Promise<results> {
    // 1. Validate default config.
    const config: results = await this.getConfig()

    // failed, throw error
    if (config.success == false && this.LoggingLevel > 0) {
      console.error(config)
      //TODO: Add error logging / management.
      throw new Error(JSON.stringify(config))
    }

    // 2. Get Args - The cli args passed in.
    const args: results = await this.getArgs()

    // failed, warning but can still continue
    if (args.success == false && this.LoggingLevel > 1) {
      console.warn(args)
    }

    // 4. Update Config with Args  - Overwrite the default config values with any matching args passed in.
    const updatedConfig: results = await this.getUpdatedConfig(args.data, config.data)
    if (updatedConfig.success == false) {
      if (this.LoggingLevel > 0) console.error(updatedConfig)
      throw new Error(JSON.stringify(updatedConfig))
    }

    return {
      success: true,
      message: `SUCCESS: Config processed successfully.`,
      data: this.config,
    }
  } // end of __init__()

  //---------------------------- Utility Functions ---------------------------//

  /**
   * @function getUpdatedConfig
   * @type {function} getUpdatedConfig
   * @memberof module:build-docs
   * @access private
   * @async
   * @param {object} args - Args is an K/V Pair object of cli args passed in and being evaluated to update config.
   * @param {object} config - Config is the default configuration for the DocsToJson utility.
   * @returns {object} - success (boolean), message (string), and data (object) containing the updated config.
   * @todo: Add logic to strip `--` prefaced to args if any just in case.
   * @todo Add validation of args to make sure they are valid.
   */
  async getUpdatedConfig(args: string[], config: Config): Promise<results> {
    const errors: any = []
    try {
      const updatedConfig = {
        ...config,
      }

      const settings = config.settings

      // 1. Loop through args and overwrite  options accordingly.
      Object.keys(args).forEach((argKey: any) => {
        // TODO: 20230713 #EP || Add validation of args.
        console.log('argKey: ', argKey, typeof argKey)

        // 2. Loop through each setting group to look for the argKey.
        // settings.forEach((setting: Setting) => {
        //   // 3. Loop through each option to look for the argKey.
        //   setting.options.forEach((option: Option) => {
        //     // 4. If the argKey matches the option title, overwrite the value.
        //     if (option.title == argKey) {
        //       if (this.LoggingLevel >= 5) {
        //         console.log(

        //           // `config.init[argKey] being overwritten: argKey: '${argKey}', old-value: '${option.value}'  new-value: '${args[`${argKey}`]}'`,
        //         )
        //       }
        //       console.log('argKey: ', argKey, typeof argKey)
        //       option.value = args[argKey]
        //     }
        //     // 5. Otherwise use the default value.
        //     else {
        //       if (this.LoggingLevel >= 5) {
        //         console.log(
        //           `config.init[argKey] not found: argKey: '${argKey}', old-value: '${option.value}'  new-value: '${args[argKey]}'`,
        //         )
        //       }
        //       option.value = option.default[0].value
        //     }
        //   }) // end of looping through options within each setting group
        // }) // end of looping through setting groups
      }) // end of looping through arg keys
      // 2. Return the updated config.
      return {
        success: true,
        message: `SUCCESS: Updated config with args successfully.`,
        data: updatedConfig,
      }
    } catch (error) {
      if (this.LoggingLevel > 0) console.error(error)

      errors.push({
        id: randomUUID(),
        type: 'fatal',
        message: `ERROR: Failed to update config with args`,
        data: error,
      })

      return {
        success: false,
        message: `ERROR: Failed to update config with args.`,
        data: error,
      }
    }
  } // end of getUpdatedConfig()

  /**
   * @type {function} getConfig
   * @memberof module:build-docs
   * @access private
   * @function getConfig
   * @summary Gets and validates the default configuration for the DocsToJson utility.
   * @description Used by the DocsToJson utility to get and then validate the integrity of the default config options. If the config is valid, returns the config object. Otherwise, throws an error.
   * @returns {object} - Verified Config object.
   * @throws {error} - Error if config cannot be parsed.
   */
  async getConfig(): Promise<results> {
    const verifiedConfig = {} // The configuration option to be returned
    const requiredSettings = ['Logging', 'Output', 'Target'] // Config options that are supported.
    const unsupportedSettings: [] = [] // holds any config options that are not supported.

    try {
      const settings = this.defaults.settings

      // 2. If the required config settings are not present, throws error.
      if (!settings) {
        console.error(`Error getting config settings. Make sure config is setup with proper 'Logging' configuration.`)
        this.errors.push({
          id: randomUUID(),
          type: 'fatal',
          message: `ERROR: getConfig() failed to process config.`,
          data: {
            error: `Config defaults are undefined or corrupted. Please check config and try again.`,
            config: this.defaults,
          },
        })

        return {
          success: false,
          message: `ERROR: getConfig() failed to process config.`,
          data: {
            error: `Config defaults are undefined or corrupted. Please check config and try again.`,
            config: this.defaults,
          },
        }
      }

      if (settings.filter((setting: Setting) => requiredSettings.includes(setting.title)).length == 0) {
        this.errors.push({
          id: randomUUID(),
          type: 'fatal',
          message: 'ERROR: getConfig() failed to process config.',
          data: {
            error: `The following config.settings group(s) are required: ${requiredSettings.join(', ')}.
            Was provided ${settings.map((setting: Setting) => setting.title).join(', ')}.`,
          },
        })
        // throw new Error(`Error getting config settings. Make sure config is setup with proper 'Logging' configuration.`)
      }

      // 4. If there are any unsupported config settings, warning, but continues.
      // TODO: Add more checking here to make sure config is valid.
      requiredSettings.forEach((requiredSettingTitle: string) => {
        settings.forEach((setting: Setting) => {
          if (!(setting.title == requiredSettingTitle)) {
            this.errors.push({
              id: randomUUID(),
              type: 'warning',
              message: 'Unsupported config.settings group(s) found.',
              data: {
                error: `The following config.settings group(s) are unsupported: ${unsupportedSettings.join(', ')}`,
              },
            })
          }
        })
      })
      //5. Return the config if no fatal errors.
      return {
        success: true,
        message: `SUCCESS: Config loaded successfully.`,
        data: verifiedConfig,
      }
    } catch (error) {
      // 6. If there are any errors, throws error.
      if (this.LoggingLevel > 0) console.error(error)

      this.errors.push({
        id: randomUUID(),
        type: 'fatal',
        message: `ERROR: lib.Config.getConfig(). Failed to process config.`,
        data: {
          error,
          verifiedConfig,
          unsupportedSettings,
        },
      })

      return {
        success: false,
        message: `ERROR: lib.Config.getConfig(). Failed to process config.`,
        data: error,
      }
    }
  } // End of getConfig()

  /**
   * @type {function} getArgs
   * @memberof module:build-docs
   * @access private
   * @async
   * @function getArgs
   * @summary Get cli args passed to the DocsToJson utility.
   * @description Used by the DocsToJson utility to parse args passed to the DocsToJson utility to customize run configuration via cli.
   * @returns {object} - success (boolean), message (string), and data (object) containing the args passed in or error.
   */
  async getArgs(): Promise<results> {
    let args: string[] = []

    try {
      // eslint-disable-next-line no-undef
      args = process.argv.slice(2)
      let argsMap: { [key: string]: string } = {}
      args.forEach((arg): any => {
        const [key, value] = arg.split('=')
        argsMap[key] = value
      })
      return {
        success: true,
        message: `SUCCESS: Args loaded successfully.`,
        data: argsMap,
      }
    } catch (error) {
      this.errors.push({
        id: randomUUID(),
        type: 'warning',
        message: `WARNING: Failed to process args.`,
        data: error,
      })

      return {
        success: false,
        message: `ERROR: Failed to process args.`,
        data: error,
      }
    }
  } // End of getArgs()
  
} // End of class Config

export default Configure
