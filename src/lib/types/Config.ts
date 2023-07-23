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
 * @changelog   0.0.2 | 2023-07-23 | Erik Plachta | docs: Cleanup and add TODOs.
 * 
 * @todo 2023-07-23 | Erik Plachta | Add final comments and finish concept.
 */

interface Config {
  logging: Logging
  output?: Output
  target?: Target
}

type Setting = {
  title: 'Logging' | 'Output' | 'Target'
  summary: string
  description: string
  options: Option[]
}


//TODO: 2023-07-23 | Erik Plachta | Determine if I want to use options/add any additional type defs.
interface Logging extends Setting {
  // option: {
  //   level: {
  //     title: 'info' | 'debug' | 'warn' | 'error' | 'fatal'
  //     value: 5 | 4 | 3 | 2 | 1 | 0
  //   }
  //   toConsole: boolean
  //   toFile: boolean
  //   fileName: string
  //   filePath: string
  //   fileFormat: 'json' | 'txt'
  //   fileWriteMode: WriteMode
  // }
}

//TODO: 2023-07-23 | Erik Plachta | Determine if I want to use options/add any additional type defs.
interface Output extends Setting {
  // option: 'outPath' | 'outName' | 'outFormat' | 'writeMode '
}

//TODO: 2023-07-23 | Erik Plachta | Determine if I want to use options/add any additional type defs.
interface Target extends Setting {
  // option: 'initPath' | 'initName'
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

export { Config, Setting, Logging, Output, Target, Option, Supported, WriteMode }
