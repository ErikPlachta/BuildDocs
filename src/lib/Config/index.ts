// Node/Javascript Utilities
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { spawn } from 'child_process' // used for args
import { resolve } from 'path' // used for building results
import { readFileSync, writeFileSync, existsSync } from 'fs' // used for reading config file

import { randomUUID } from 'crypto'
import { Config, Logging_config, ConfigGroupDefaults, UserConfig, Option, ErrorRecord } from '../types'
import { config } from './default'
import { DataManager } from '../../utils/DataManager'

type results = {
  success: boolean
  message: string
  data: any
  errors?: []
}

type Validator = {
  key: string
  validator: (val: any) => boolean
}

/**
 * @module HandleConfig
 * @class HandleConfig
 * @description HandleConfig is a class that handles the configuration options for the DocsToJson utility.
 * @summary Handles the configuration options for the build-docs utility.
 * @memberof module:build-docs
 * @access private
 * @version 0.0.3
 * @author Erik Plachta
 * @since 2021-07-22
 *
 * @changelog  0.0.1 | 2023-07-22 | Erik Plachta | docs: Built sub-module by extracting from root index.js. (Segmenting code to build into class and add additional features.)
 * @changelog  0.0.2 | 2023-07-22 | Erik Plachta | docs: Rebuilt into a class that is managing the Config.
 * @changelog  0.0.3 | 2023-07-23 | Erik Plachta | Add more comments and cleanup.
 *
 * @todo  2023-07-23 | Erik Plachta | Add complete data-integrity checking,
 * @todo  2023-07-23 | Erik Plachta | Add validation of config defaults.
 * @todo  2023-07-23 | Erik Plachta | Add feature to get `.build-docs` from root.
 * @todo  2023-07-23 | Erik Plachta | Add validation of args through CLI and `.build-docs` in root.
 */
class Configure {
  public defaults: Config = config // The default configuration options.
  public config: any
  public args: any
  public unsupportedSettings: any
  public errors: ErrorRecord[] = []
  public getConfig: () => Config
  private dm: DataManager = new DataManager()
  public UserConfig: UserConfig = {}

  private UserConfigValidation: {
    DocsToJsonValidators: Validator[]
    DocsToUiValidators: Validator[]
    loggingValidators: Validator[]
    outputValidators: Validator[]
    targetValidators: Validator[]
  }
  // public settings:Config['settings']

  constructor() {
    this.defaults = { ...config }
    this.config = {}
    this.args = {}
    this.unsupportedSettings = []
    this.errors = []
    // this.settings = []

    this.UserConfig = {}

    this.UserConfigValidation = {
      DocsToJsonValidators: ([] = [
        { key: 'outputName', validator: (val: any) => typeof val === 'string' },
        { key: 'outputFormat', validator: (val: any) => ['json'].includes(val) },
        { key: 'writeMode', validator: (val: any) => ['append', 'new', 'overwrite', 'prepend'].includes(val) },
      ]),
      DocsToUiValidators: ([] = [
        { key: 'customOutputPath', validator: (val: any) => typeof val === ('string' || undefined) },
        { key: 'outputName', validator: (val: any) => typeof val === ('string' || undefined) },
        { key: 'buildHtml', validator: (val: any) => typeof val === 'boolean' || val == ('true' || 'false') },
        { key: 'buildMarkdown', validator: (val: any) => typeof val === 'boolean' || val == ('true' || 'false') },
        { key: 'writeMode', validator: (val: any) => ['append', 'new', 'overwrite', 'prepend'].includes(val) },
      ]),

      loggingValidators: ([] = [
        { key: 'level', validator: (val: any) => [0, 1, 2, 3, 4, 5].includes(val) },
        { key: 'toConsole', validator: (val: any) => typeof val === 'boolean' },
        { key: 'toFile', validator: (val: any) => typeof val === 'boolean' },
        { key: 'fileName', validator: (val: any) => typeof val === 'string' },
        { key: 'filePath', validator: (val: any) => typeof val === 'string' },
        { key: 'fileFormat', validator: (val: any) => ['json', 'txt'].includes(val) },
        { key: 'writeMode', validator: (val: any) => ['append', 'new', 'overwrite', 'prepend'].includes(val) },
      ]),

      outputValidators: ([] = [
        { key: 'outputPath', validator: (val: any) => typeof val === 'string' },
        { key: 'outputFolderName', validator: (val: any) => typeof val === 'string' },
      ]),

      targetValidators: ([] = [
        { key: 'targetPath', validator: (val: any) => typeof val === 'string' },
        {
          key: 'targetPaths',
          validator: (val: any) => Array.isArray(val) && val.every((v: any) => typeof v === 'string'),
        },
        {
          key: 'ignorePaths',
          validator: (val: any) => Array.isArray(val) && val.every((v: any) => typeof v === 'string'),
        },
        {
          key: 'ignoreFiles',
          validator: (val: any) => Array.isArray(val) && val.every((v: any) => typeof v === 'string'),
        },
        {
          key: 'targetFiles',
          validator: (val: any) => Array.isArray(val) && val.every((v: any) => typeof v === 'string'),
        },
        {
          key: 'targetFileTypes',
          validator: (val: any) => Array.isArray(val) && val.every((v: any) => typeof v === 'string'),
        },
      ]),
    }

    //---------------------------------
    //-- Helper Methods for this class
    this.getConfig = () => {
      return this.config
    }
  }

  /**
   * @function run
   * @type {function} run
   * @memberof module:build-docs
   * @access public
   * @async
   * @summary Runs the configuration process for the DocsToJson utility.
   * @description Runs the configuration process for the DocsToJson utility. This includes getting the config, getting the args, and updating the config with the args.
   *
   */
  async run(): Promise<results> {
    // 1. Validate default config.
    const config: results = await this.validateConfig()
    // failed, throw error
    if (config.success == false) {
      if (this.getLogLevel() > 0) console.error(config)
      throw new Error('ERROR: Config.__init__(): Invalid config.')
    }
    // Set config as defaults for now.
    this.config = config.data

    // 2. Get Args - The cli args passed in.
    const args: results = await this.getArgs()
    this.args = args.data
    // failed, warning but can still continue
    if (args.success == false && this.getLogLevel() > 1) {
      console.warn(args)
    }
    if (this.getLogLevel() >= 5) console.log('config.data: ', config.data)

    // 3. Get User Config - The user config from the root `.build-docs` file.
    const userConfig: results = await this.getUserConfig()
    // failed, warning but can still continue
    if (this.getLogLevel() >= 4)
      console.log('WARNING: Failed to load user config. Using defaults. Reverting to defaults.')
    this.UserConfig = userConfig.data

    // 4. Update Config with Args through CLI or through `.build-docs`.
    const updatedConfig: results = await this.getUpdatedConfig(args.data, config.data, userConfig.data)
    if (updatedConfig.success == false) {
      if (this.getLogLevel() > 0) console.error(updatedConfig)
      throw new Error(JSON.stringify(updatedConfig))
    }

    // console.log('updatedConfig: ', updatedConfig)
    // 5. Otherwise, update class properties.
    this.config = { ...updatedConfig.data }

    return {
      success: true,
      message: `SUCCESS: Config processed successfully.`,
      data: this,
    }
  } // end of run()

  //---------------------------- Utility Functions ---------------------------//

  /**
   * @function getLogLevel
   * @type {function} getLogLevel
   * @memberof module:build-docs.Config
   * @access public
   * @summary Gets the logging level for the DocsToJson utility.
   * @return {number} none, 1 = fatal, 2 = error, 3 = warn, 4 = debug, 5 = info
   */
  getLogLevel = (): number => {
    //TODO: Update this to get the true log level
    return 2
  }

  /**
   * Get the user config from the root `.build-docs` file.
   *
   * @function getUserConfig - Get the user config from the root `.build-docs` file.
   * @type {function} getUserConfig
   * @memberof module:build-docs.Config
   * @access private
   * @async
   * @summary Get the user config from the root `.build-docs` file.
   * @description Looks for a `.build-docs` file in the root of the project and returns the config if found. Otherwise, returns undefined.
   * @returns {{Promise<results>}} - success (boolean), message (string), and data (object) containing the user config or error.
   */
  async getUserConfig(): Promise<results> {
    try {
      const configPath = resolve('./.build-docs')

      if (!existsSync(`${configPath}`)) {
        this.errors.push({
          id: randomUUID(),
          type: 'warning',
          message: `WARNING: Failed to load user config.`,
          data: `Config file does not exist.`,
        })
        if (this.getLogLevel() >= 3) throw new Error('Config file does not exist.')
      }

      // Load the user config data
      const userConfig = await import(configPath)

      // Validate the user config data
      const isValidUserConfig = this.isValidUserConfig(userConfig)

      
      
      // Log the results of the validation if warning or higher.
      if (this.getLogLevel() >= 4) {
        console.log('isValidUserConfig results: ')
        isValidUserConfig.forEach((group: any) => {
          console.log(`\t${group.group}: `)
          group.data.forEach((option: any) => {
            option.formatted = `${option.key}: ${option.value}\n\t\t- isValid: (${
              option.isValid
            })\n\t\t- option: ${JSON.stringify(option)}`

            console.log(`\t\t${option.formatted}`)
          })
        })
      }

      // Set the user config.
      this.UserConfig = userConfig

      return {
        success: true,
        message: `SUCCESS: User config loaded successfully.`,
        data: userConfig,
      }
    } catch (error) {
      if (this.getLogLevel() > 0) console.error(error)

      this.errors.push({
        id: randomUUID(),
        type: 'warning',
        message: `WARNING: Failed to load user config.`,
        data: error,
      })

      return {
        success: false,
        message: `ERROR: Failed to load user config.`,
        data: error,
      }
    }
  }

  /**
   * Executes validation against all UserConfig definitions to ensure that the UserConfig is valid.
   *
   * @param {UserConfig} userConfig - The UserConfig file to be validated
   * @returns
   */
  isValidUserConfig(userConfig: UserConfig): any[] {
    let result: any[] = []

    // Get the validators for each group.
    const validatorsByGroup = {
      DocsToJson: this.UserConfigValidation.DocsToJsonValidators,
      DocsToUi: this.UserConfigValidation.DocsToUiValidators,
      Logging: this.UserConfigValidation.loggingValidators,
      Output: this.UserConfigValidation.outputValidators,
      Target: this.UserConfigValidation.targetValidators,
    }

    // Loop through each group and validate each option.
    for (const [groupName, validators] of Object.entries(validatorsByGroup)) {
      const group = { group: groupName, data: [] as any[] }
      const groupKey = groupName as keyof UserConfig // type assertion here
      const configGroup = userConfig[groupKey]
      if (configGroup) {
        for (const { key, validator } of validators) {
          const value = configGroup[key as keyof typeof configGroup] // type assertion here
          group.data.push({
            key: key,
            value: value,
            isValid: validator(value),
          })
        }
      }
      result.push(group)
    }

    return result
  } // END of isValidUserConfig()

  /**
   * @function getUpdatedConfig
   * @type {function} getUpdatedConfig
   * @memberof module:build-docs
   * @access private
   * @async
   * @param {object} args - Args is an K/V Pair object of cli args passed in and being evaluated to update config.
   * @param {object} config - Config is the default configuration for the DocsToJson utility.
   * @param {object | undefined} userConfig - `userConfig` is defined if user has a `.build-docs` file in root. If defined, evaluated to update config accordingly.
   * @returns {object} - success (boolean), message (string), and data (object) containing the updated config.
   * @todo: Add logic to strip `--` prefaced to args if any just in case.
   * @todo Add validation of args to make sure they are valid.
   * @todo Onboard userConfig
   */
  async getUpdatedConfig(args: { [key: string]: string }, config: Config, userConfig: UserConfig): Promise<results> {
    try {
      const updatedConfig = {
        ...config,
      }

      console.log('TODO: Add userConfig to updatedConfig.')

      /**
       *  1. Check to see if there are any matches for any args within config options for each config group.
       *
       *  For each arg, search through options to see if there is a match.
       *  -  If there is, return the arg and the option.
       *  - If there is not, return the arg and undefined.
       */
      let argsMatched: any[] = []

      Array.from(Object.keys(args)).forEach(argKey => {
        Array.from(Object.keys(updatedConfig)).forEach(configKey => {
          updatedConfig[configKey].options.forEach((option: Option) => {
            if (option.title == argKey) {
              argsMatched.push({
                title: option.title,
                newValue: args[argKey],
                oldValue: option.value,
                type: option.type,
                configGroup: configKey,
                updated: false,
              })
            }
          })
        })
      })

      if (this.getLogLevel() >= 4) console.log('argsMatched: ', argsMatched)

      /**
       * 2. Loop through updatedConfig options, look for argsMatched, set value accordingly.
       *
       * For each arg, loop through each option to look for the argKey.
       * - If the argKey matches the option title, overwrite the value.
       * - Otherwise, set value as default.
       */
      Array.from(Object.keys(updatedConfig)).forEach(configKey => {
        updatedConfig[configKey].options.forEach((option: Option) => {
          // 3. If the argKey matches the option title, overwrite the value.
          const argMatch = argsMatched.find((argMatch: any) => option.title == argMatch.title)
          if (argMatch && argMatch.newValue) {
            argMatch.updated = true
            if (this.getLogLevel() >= 4) {
              console.log('CLI arg matched config option: ', argMatch)
            }
            option.value = argMatch.newValue
          }
          // 4. Otherwise, set value as default.
          else {
            // Extract default values.
            if (option.type == 'string') {
              option.value = option?.default
                .map((defaultOption: any) => {
                  return defaultOption.value
                })
                .join(',')
            } else if (option.type == 'string[]') {
              option.value = option?.default.map((defaultOption: any) => {
                return defaultOption.value
              })
            } else {
              option.value = option?.default.map((defaultOption: any) => {
                return defaultOption.value
              })
            }
          }
        }) // END loop on updatedConfig.options
      }) // END loop on updatedConfig

      // 7. Return the updated config.
      return {
        success: true,
        message: `SUCCESS: Updated config with args successfully.`,
        data: updatedConfig,
      }
    } catch (error) {
      if (this.getLogLevel() > 0) console.error(error)

      this.errors.push({
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
   * @type {function} validateConfig
   * @memberof module:build-docs
   * @access private
   * @function validateConfig
   * @summary Gets and validates the default configuration for the DocsToJson utility.
   * @description Used by the DocsToJson utility to get and then validate the integrity of the default config options. If the config is valid, returns the config object. Otherwise, throws an error.
   * @returns {object} - Verified Config object.
   * @throws {error} - Error if config cannot be parsed.
   */
  async validateConfig(): Promise<results> {
    const config: Config = {
      ...this.defaults,
    } // The configuration option to be returned
    const requiredKeys: string[] = ['Logging', 'Output', 'Target', 'DocsToJson', 'DocsToUi'] // Config options that are supported.
    const unsupportedSettings: [] = [] // holds any config options that are not supported.

    try {
      // 2. If the required config settings are not present, throws error.
      if (!config) {
        console.error(`Error getting config. Make sure config is setup with proper 'Logging' configuration.`)
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

      // 3. Verify Configuration
      const { missingKeys, extraKeys } = this.dm.checkKeys(requiredKeys, config)

      // 4. If there are any missing config settings, throws fatal error. (The whole program to exit with error.)
      if (extraKeys.length > 0) {
        this.errors.push({
          id: randomUUID(),
          type: 'fatal',
          message: 'ERROR: getConfig() failed to process config.',
          data: {
            error: 'getConfig() failed to process config. Required config groups are missing.',
            missingKeys,
            requiredKeys,
            unsupportedSettings,
          },
        })
        console.error(
          `WARNING: The config file contains unexpected values. Please verify config and try again.\n\t - ${extraKeys.join(
            ', ',
          )}\n`,
        )
      }

      // 4. If there are any unsupported config settings, warning, but continues. (These settings will be ignored, but the program will continue to run.)
      if (extraKeys.length > 0) {
        this.errors.push({
          id: randomUUID(),
          type: 'warning',
          message: `Unsupported config.settings group found.`,
          data: {
            error: `The following config.settings group(s) are unsupported: ${extraKeys.join(', ')}`,
          },
        })
      }

      //5. No fatal errors, return the config.
      return {
        success: true,
        message: `SUCCESS: Config loaded successfully.`,
        data: config,
      }
    } catch (error) {
      // 6. If there are any errors, throws error.
      if (this.getLogLevel() > 0) console.error(error)

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
