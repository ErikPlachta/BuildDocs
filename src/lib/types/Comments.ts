
import {ProcessedDataItem } from './index'

/**
 * @type {Type} Comment
 * @memberof module:Types
 * @typedef Comment
 * @summary The result of extracting documentation from a file.
 * @description Comment block default structure when extracted from source file.
 * @prop {ProcessedDataItem['id']} id - The unique identifier for the file.
 * @prop {string} line - The line number the comment block starts on.
 */
export type Comment ={
  id: ProcessedDataItem['id']
  line: string
  type: string
  description: string
}


/**
 * @type {Type} Doc
 * @memberof module:Types
 * @typedef Doc
 * @summary The result of extracting documentation from the comment block.
 */
export type Doc = {
  [key: string]: Comment[]
}

/**
 * @type {Type} DocResult
 * @memberof module:Types
 * @memberof module:DocsToJson
 * @interface DocResult
 * @summary The result of extracting documentation from a file.
 * @description The result of extracting documentation from a file.
 * @prop {string} id - The unique identifier for the file.
 * @prop {string} fileName - The name of the file itself.
 * @prop {string} filePath - The path to the file.
 * @prop {object} doc - The documentation extracted from the file.
 * @prop {Date} modifiedDate - The date the file was last modified.
 * @prop {Date} createdDate - The date the file was created.
 * @prop {object[]} relatedComments - All comments extracted from the file.
 */
export type DocResult = {
  id: ProcessedDataItem['id']
  fileName: string
  filePath: string
  doc: Doc
  modifiedDate: Date
  createdDate: Date
  //-- All related comments and their full comment blocks within the file.
  //TODO: 20230713 #EP || Convert from getting all comments to showing relation by IDs, children, parent, etc.
  relatedComments: {
    commentBlock: string
  }[]
  // relatedComments: { comment: string }[]
}






export {
  Comment,
  Doc,
  DocResult
}