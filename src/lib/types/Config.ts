/**
 * Type definitions for build-docs config.json file.
 *
 * @file Config.ts
 * @path build-docs\types\Config.ts
 * @summary Type definitions for build-docs config.json file.
 * @type {Type} Config
 * @created 2021-07-22
 * @version 0.0.1
 * @author Erik Plachta
 * @since 0.0.1
 * @memberof Types
 */

interface Config {
  title: string
  namespace: string
  summary : string
  description: string
  version: string
  author: string
  settings: Setting[]
}

type Setting = {
  title: 'Logging' | 'Output' | 'Target'
  summary: string
  description: string
  options: Option[]
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
  title: 'Overwrite' | 'Append' | 'Prepend' | 'New'
  description: string
  value: 'overwrite' | 'append' | 'prepend' | 'new'
}

interface Output extends Setting {
  option: 'outPath' | 'outName' | 'outFormat' | 'writeMode '
}

interface Logging extends Setting {
  option: {
    level: {
      title: 'info' | 'debug' | 'warn' | 'error' | 'fatal'
      value: 5 | 4 | 3 | 2 | 1 | 0
    }
    toConsole: boolean
    toFile: boolean
    fileName: string
    filePath: string
    fileFormat: 'json' | 'txt'
    fileWriteMode: WriteMode
  }
}

interface Target extends Setting {
  option: 'initPath' | 'initName'
}

export { Config, Setting, Logging, Output, Target, Option, Supported, WriteMode }
