// Node/Javascript Utilities
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { spawn } = require('child_process') // used for args
const { resolve } = require('path') // used for building results
const { readFileSync, writeFileSync } = require('fs') // used for reading config file

import { randomUUID } from 'crypto'
import { Config, Logging, Setting, Option, ErrorRecord } from '../types'
import {config} from './default'

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
  public defaults: Config = config // The default configuration options.
  public LoggingLevel: Logging['option']['level']['value']
  public config: any
  public args: any
  public unsupportedSettings: any
  public errors: ErrorRecord[] = []

  constructor() {
    this.defaults = config
    this.LoggingLevel = 5
    this.config = {}
    this.args = {}
    this.unsupportedSettings = []
    this.errors = []

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
        return {
          success: false,
          message: `ERROR: Failed to process config: ${error.message}`,
          data: this.config,
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

    console.log('config.data: ', config.data)

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
  async getUpdatedConfig(args: { [key: string]: string }, config: Config): Promise<results> {
    const errors: any = []
    try {
      const updatedConfig = {
        ...config,
      }
      const settings = updatedConfig.settings

      // console.log('getUpdatedConfig.settings: ', config)
      // console.log('args: ', args)

      // 1. Loop through args and overwrite  options accordingly.
      Object.keys(args).forEach(argKey => {
        // TODO: 20230713 #EP || Add validation of args.
        console.log('argKey: ', argKey, typeof argKey, '. value: ', args[argKey])

        // 2. Loop through each setting group to look for the argKey.
        settings.forEach((setting: Setting) => {
          // 3. Loop through each option to look for the argKey.
          setting.options.forEach((option: Option) => {
            // 4. If the argKey matches the option title, overwrite the value.
            if (option.title == argKey) {
              if (this.LoggingLevel >= 5) {
                console.log(
                  `config.init[argKey] being overwritten: argKey: '${argKey}', old-value: '${option.default[0].value}'  new-value: '${args[argKey]}'`,
                )
              }
              console.log('argKey: ', argKey, typeof argKey, '. value: ', args[argKey])
              option.value = args[argKey]
            }
            // 5. Otherwise use the default value.
            else {
              // Extract default values.
              option.value = option?.default.map((defaultOption: any) => { return defaultOption.value })
              
              if (this.LoggingLevel >= 5) {
                // console.log('option.default', option)
                console.log(
                  `config.init[argKey] not found: argKey. '${argKey}'. Using default-values: '${option.value}'`,
                )
              }
              
            }
          }) // end of looping through options within each setting group
        }) // end of looping through setting groups
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
        message: `ERROR: Config.getUpdatedConfig() Failed to update config with args.`,
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
    const config: Config = {
      ...this.defaults,
    } // The configuration option to be returned
    const requiredSettings: string[] = ['Logging', 'Output', 'Target'] // Config options that are supported.
    const unsupportedSettings: [] = [] // holds any config options that are not supported.

    try {
      const settings = config.settings

      // 2. If the required config settings are not present, throws error.
      if (!settings) {
        console.error(`Error getting config settings. Make sure config is setup with proper 'Logging' configuration.`)
        this.errors.push({
          id: randomUUID(),
          type: 'fatal',
          message: `ERROR: getConfig() failed to process config.`,
          data: { error: `Config defaults are undefined or corrupted. Please check config and try again.` },
        })
        return {
          success: false,
          message: `ERROR: getConfig() failed to process config.`,
          data: { error: `Config defaults are undefined or corrupted. Please check config and try again.` },
        }
      }

      if (settings.filter((setting: Setting) => requiredSettings.includes(setting.title)).length == 0) {
        this.errors.push({
          id: randomUUID(),
          type: 'fatal',
          message: 'ERROR: getConfig() failed to process config.',
          data: {
            error: 'getConfig() failed to process config. Required config.settings groups are missing.',
            requiredSettings,
            unsupportedSettings,
          },
        })
        // throw new Error(`Error getting config settings. Make sure config is setup with proper 'Logging' configuration.`)
      }

      // 4. If there are any unsupported config settings, warning, but continues.
      // TODO: Add more checking here to make sure config is valid.
      requiredSettings.forEach((requiredSettingTitle: string) => {
        settings.forEach(({ title }: Setting) => {
          if (!(title == requiredSettingTitle)) {
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
        data: config,
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
          config,
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
      args.forEach((arg: string) => {
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

module.exports = Configure
