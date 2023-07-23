/**
 * @file types\index.ts
 * @path build-docs\types\index.ts
 * @summary TypeScript Types used within the build-docs utility.
 * @module Types
 * @namespace {build-docs.Types}
 * @access private
 * @version 0.0.2
 * @since 2021-07-14
 * @license MIT
 *
 */

import { Element, Elements, ElementsProcessed, htmlConfig } from './Elements'
import { CommentRaw, CommentsRaw, CommentsProcessed, Comments } from './Comments'
import { Config, Logging, Output, Target, Setting, Option  } from './Config'

/**
 * @type {Type}
 * @memberof module:Types
 * @typedef File
 */
type File = {
  id: string //-- randomUUID
  description: string //-- file name for reference
  filePath: string //-- for connecting all items to their file.
}

/**
 * @type {Type}
 * @memberof module:Types
 * @typedef Namespace
 */
type Namespace = {
  id: string
  description: string
}

/**
 * @type {Type}
 * @typedef Module
 * @memberof module:types
 */
type Module = {
  id: string
  description: string
}

/**
 * Used by JsonToUi to define runtime configuration options.
 * 
 * @summary Used by JsonToUi to define runtime configuration options.
 * @description Defined by `Config.settings` -> `Output` -> `options` ->
 *  `outputFormat.value`, these options are used to run time behavior.
 */
type JsonToUiConfig = {
  outputFormat : {
    markdown : boolean
    html : boolean
  }
 
}

type ErrorRecord = {
  id : string
  type: 'warning' | 'error' | 'fatal'
  message: string
  data: any
}


//-- Export all types
export {
  // Configuration options
  Config,
  Logging,
  Output,
  Target,
  Setting, 
  Option,
  

  //TODO: identify where these are being used and note properly..
  File,
  Namespace,
  Module,
  ErrorRecord,

  //-- GetDocs
  CommentRaw,
  CommentsRaw,

  //-- DocsToJson && JsonToUi:
  CommentsProcessed,

  //-- JsonToUi
  Comments,
  JsonToUiConfig,
  Element,
  Elements,
  ElementsProcessed,
  htmlConfig
}
