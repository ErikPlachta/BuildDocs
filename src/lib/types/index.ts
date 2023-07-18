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
import { Comment, Doc, DocResult } from "./Comments";
import { ProcessedDataItem } from "./ProcessedData";



/**
 * @type {Type} DataItem
 * @memberof module:Types
 */
export type DataItem = {
  id: string
  fileName: string
  filePath: string
  doc : Doc
  createdDate: string
  modifiedDate: string
  relatedComments: string[]
}

/**
 * @type {Type} Namespace
 * @memberof module:Types
 */
export type Namespace = {
  id: string
  description: string
}

/**
 * @type {Type} Module
 * @memberof module:Types
 */
export type Module = {
  id: string
  description: string
}



export type JsonToUiConfig = {
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

  Comment,
  Doc,
  DocResult,

  ProcessedDataItem,

  //-- Content to Render to UI Types
  Elements,
  Element
}