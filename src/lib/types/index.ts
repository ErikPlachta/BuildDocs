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

import { Element, Elements, ElementsProcessed } from "./Elements";
import { Comment, Comments, CommentsRaw, CommentsProcessed } from "./Comments";


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

type JsonToUiConfig = {
  convertToMarkdown: boolean
  convertToHtml: boolean
}




//-- Export all types
export {
  File,
  Namespace,
  Module,
  

  //-- Building comments from source
  Comment,
  Comments,
  CommentsRaw,
  CommentsProcessed,

  //-- Content to Render to UI Types
  Element,
  Elements,
  ElementsProcessed,


  //-- Configurations
  JsonToUiConfig
}