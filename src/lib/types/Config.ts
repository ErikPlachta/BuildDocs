/**
 * Type definitions for build-docs config.json file.
 *
 * @file Config.ts
 * @path build-docs\types\Config.ts
 * @summary Type definitions for build-docs config.json file.
 * @type {Type} Config
 * @created 2021-07-22
 * @version 0.0.2
 * @author Erik Plachta
 * @since 0.0.1
 * @memberof Types
 *
 * @changelog   0.0.1 | 2023-07-23 | Erik Plachta | docs: Finalize concept.
 * @changelog   0.0.2 | 2023-07-23 | Erik Plachta | docs: Cleanup, add TODOs, add UserConfig.
 *
 * @todo 2023-07-23 | Erik Plachta | Determine if I should make ConfigGroups modules.
 * @todo 2023-07-23 | Erik Plachta | Add final comments and finish concept.
 */

interface Config {
  [key: string]: ConfigGroupDefaults
  DocsToJson: ConfigGroupDefaults
  DocsToUi: ConfigGroupDefaults
  Logging: ConfigGroupDefaults
  Target: ConfigGroupDefaults
  Output: ConfigGroupDefaults
}

type ConfigGroupDefaults = {
  title: ConfigCategories
  summary: string
  description: string
  options: Option[]
}
type ConfigCategories = 'Logging' | 'Output' | 'Target' | 'DocsToJson' | 'DocsToUi'

//-------------------------------------
//-- Logging

/**
 * @typedef Logging
 * @type {Type} Logging
 * @memberof module:build-docs.types.config
 * @summary Logging configuration options.
 * @description Definition of all available options and their defaults for the logging configuration.
 * @prop {Option[]} options - An array of all available options.
 * @prop {Option} options.level - The level of logging to use.
 * @prop {Option} options.toConsole - Whether or not to log to the console.
 * @prop {Option} options.toFile - Whether or not to log to a file.
 * @prop {Option} options.filePath - The path to the file to log to.
 * @prop {Option} options.fileNameIncludeDate - Whether or not to include the date in the log.
 * @prop {Option} options.fileNameIncludeTime - Whether or not to include the time in the log.
 * @prop {Option} options.fileNameIncludeRoot - Whether or not to include the root path in the log.
 * @prop {Option} options.fileFormat - The format to use for the log.
 * @prop {Option} options.fileWriteMode - The write mode to use for the log.
 */
type Logging_config = {
  level: {
    value: 0 | 1 | 2 | 3 | 4 | 5 // 0 = none, 1 = fatal, 2 = error, 3 = warn, 4 = debug, 5 = info
    default: 3
  }
  toConsole: {
    value: boolean
    default: true
  }
  toFile: {
    value: boolean
    default: true
  }
  filePath: {
    value: string
    default: './.build'
  }
  fileNameIncludeDate: {
    value: boolean
    default: true
  }
  fileNameIncludeTime: {
    value: boolean
    default: true
  }
  fileNameIncludeRoot: {
    value: boolean
    default: true
  }
  fileFormat: {
    value: 'json' | 'txt'
    default: 'json'
  }
  writeMode: WriteMode
}

//-------------------------------------
//-- Output

interface Output_config {
  outputPath: {
    value: string
    default: './build'
  }
  outputFolderName: {
    value: string
    default: 'docs'
  }
}

//-------------------------------------
//-- Target

/**
 * @typedef Target_Config
 * @type {Type} Target_config
 * @memberof module:build-docs.types.config
 * @summary Target configuration options.
 * @description Definition of all available options and their defaults for the Target configuration.
 * @prop {Option[]} options - An array of all available options.
 * @prop {Option} options.outputPath - The path to the output file.
 * @prop {Option} options.outputName - The name of the output file.
 * @prop {Option} options.outputFormat - The format of the output file.
 * @prop {Option} options.targetPath - The path to the target file.
 * @prop {Option} options.targetPaths - The paths to the target files.
 * @prop {Option} options.ignorePaths - The paths to ignore.
 * @prop {Option} options.ignoreFiles - The files to ignore.
 * @prop {Option} options.targetFiles - The files to target.
 * @prop {Option} options.targetFileTypes - The file types to target.
 * @prop {Option} options.writeMode - The write mode to use for the output file.
 */
type Target_config = {
  outputPath: Option & {
    value: string
    default: './build'
  }
  outputName: Option & {
    value: string
    default: 'docs'
  }
  outputFormat: Option & {
    value: 'json' | 'txt'
    default: 'json'
  }
  targetPath: Option & {
    value: string
    default: './'
  }
  targetPaths: Option & {
    value: string[]
    default: []
  }
  ignorePaths: Option & {
    value: string[]
    default: [
      'node_modules',
      '.git',
      '.build',
      '.vscode',
      '.github',
      'backup',
      'backups',
      'build',
      'cache',
      'caches',
      'coverage',
      'dump',
      'dumps',
      'dist',
      'docs',
      'log',
      'logs',
      'out',
      'temp',
      'tmp',
    ]
  }
  ignoreFiles: Option & {
    value: string[]
    default: string[]
  }
  targetFiles: Option & {
    value: string[]
    default: string[]
  }
  targetFileTypes: Option & {
    value: string[]
    default: string[]
  }
  writeMode: Option & WriteMode
}

//-------------------------------------
//-- DocsToUi

/**
 * @typedef DocsToUi
 * @type {Type} DocsToUi
 * @memberof module:build-docs.types.config
 * @summary DocsToUi configuration options.
 * @description Definition of all available options and their defaults for the DocsToUi configuration.
 * @prop {Option[]} options - An array of all available options.
 * @prop {Option} options.outputPath - The path to the output file.
 * @prop {Option} options.outputName - The name of the output file.
 * @prop {Option} options.outputFormat - The format of the output file.
 * @prop {Option} options.writeMode - The write mode to use for the output file.
 * @prop {Option} options.buildHtml - Whether or not to build the HTML output.
 */
type DocsToUi_config = {
  customOutputPath: {
    value: undefined | string
    default: undefined
  }
  outputName: {
    value: string
    default: 'docs'
  }
  language: {
    value: 'html' | 'md'
    default: 'html'
  }
  buildHtml: {
    value: boolean
    default: true
  }
  buildMarkdown: {
    value: boolean
    default: false
  }
  writeMode: WriteMode
}

//-------------------------------------
//-- DocsToJson

type DocsToJson_config = {
  customOutputPath: {
    value: undefined | string
    default: undefined
  }
  outputName: {
    value: string
    default: 'docs'
  }
  outputFormat: {
    value: 'json'
    default: 'json'
  }
  writeMode: WriteMode
}

//-------------------------------------
//-- User Config

/**
 * Used to validate user config file if exists.
 *
 * @description If there is a `.build-docs` | `.build.docs.js` file in the root of the project, it will be used to override the default config.
 */
type UserConfig = {
  DocsToJson?: {
    customOutputPath?: string
    outputName?: string
    outputFormat?: 'json' | 'txt'
    writeMode?: WriteMode['value']
  }
  DocsToUi?: {
    customOutputPath?: string
    outputName?: string
    language?: 'html' | 'md'
    buildHtml?: boolean
    buildMarkdown?: boolean
    writeMode?: WriteMode['value']
  }
  Logging?: {
    level?: 0 | 1 | 2 | 3 | 4 | 5 // 0 = none, 1 = fatal, 2 = error, 3 = warn, 4 = debug, 5 = info
    toConsole?: boolean
    toFile?: boolean
    fileName?: string
    filePath?: string
    fileFormat?: 'json' | 'txt'
    writeMode?: WriteMode['value']
  }
  output?: {
    outputPath?: string
    outputFolderName?: string
  }
  target?: {
    targetPath?: string
    targetPaths?: string[]
    ignorePaths?: string[]
    ignoreFiles?: string[]
    targetFiles?: string[]
    targetFileTypes?: string[]
  }
}

type Option = {
  title: string
  description: string
  type: string
  required: boolean
  enabled: boolean
  value: any
  default: Default[]
  supported?: Supported[]
  memberOf?: string
  dependentOn?: string[]
  reference?: string
}

interface Supported extends Definition {}
interface Default extends Definition {}

type Definition = {
  title: string
  value: any
  description: string
}

type WriteMode = {
  value: 'overwrite' | 'append' | 'prepend' | 'new'
  default: 'new'
}

export {
  Config,
  ConfigGroupDefaults,
  UserConfig,
  DocsToJson_config,
  DocsToUi_config,
  Target_config,
  Logging_config,
  Output_config,
  Option,
  Supported,
  WriteMode,
}
