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

import { Elements, Element } from "./Elements";
import { Comment, Comments, CommentsRaw, CommentsProcessed } from "./Comments";


/**
 * @type {Type} Namespace
 * @memberof module:Types
 * @typedf {Type} Namespace
 */
type Namespace = {
  id: string
  description: string
}

/**
 * @type {Type} Module
 * @typedf {Type} Module
 * @memberof module:Types
 */
type Module = {
  id: string
  description: string
}


type JsonToUiConfig = {
  convertToMarkdown: boolean
  convertToHtml: boolean
}

type File = {
  id: string //-- randomUUID
  description: string //-- file name for reference
  filePath: string //-- for connecting all items to their file.
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
  Elements,
  Element,


  //-- Configurations
  JsonToUiConfig
}