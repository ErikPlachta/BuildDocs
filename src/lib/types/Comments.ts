/**
 * @module Types.Comments
 * @memberof module:Types
 * @summary Type Definitions for all Comments extracted and parsed.
 *
 * @changelog 2023-07-18 | Erik Plachta | chore: Update JSDocs, and extracted from index now that role is clear.
 */

//------------------------------------------------------------------------------
//-- GetDocs

/**
 * @type {interface} CommentRaw
 * @access private
 * @memberof module:GetDocs
 * @summary Type definitions for the Tag object.
 * @description An object for each tag within a comment block.
 * @prop {string} line - The entire line of the tag.
 * @prop {string} type - The type of the tag.
 * @prop {string} description - The description of the tag.
 * @prop {string} index - The index of the tag.
 * @prop {string} raw - The raw input of the tag.
 */
type CommentRaw = {
  line: string
  type: string
  description: string
  index: string
  raw: string
}

/**
 * @type {interface} CommentsRaw
 * @memberof module:GetDocs
 * @access private
 * @summary Type definitions for the Tags object.
 * @description An array of tag objects for each comment block, which is used to populate the 'doc' object within results.
 * @prop {string} key - The key of the tag.
 * @prop {Array<Tag>} value - The value of the tag.
 */
type CommentsRaw = {
  [key: string]: Array<CommentRaw>
}

//------------------------------------------------------------------------------
//-- DocsToJson

/**
 * @type {Type} CommentParsed
 * @memberof module:build-docs.types.comments
 * @typedef CommentParsed
 * @summary The result of extracting documentation from a file.
 * @description Comment block default structure when extracted from source file.
 * @prop {CommentsProcessed['id']} id - The unique identifier for the file.
 * @prop {string} line - The line number the comment block starts on.
 */
type CommentParsed = {
  id: string
  line: string
  type: string
  description: string
}

/**
 * @type {Type} CommentsParsed
 * @memberof module:build-docs.types.comments
 * @typedef CommentsParsed
 * @summary The result of extracting documentation from the comment block.
 * @prop {string} id - The unique identifier for the file.
 * @prop {string} line - The line number the comment block starts on.
 */
type CommentsParsed = {
  [key: string]: Comment[]
}

/**
 * @type {Type} Comments
 * @memberof module:build-docs.types.comments
 * @memberof module:build-docs.DocsToJson
 * @typedef Comments
 * @summary The result of extracting documentation from a file.
 * @description The result of extracting documentation from a file.
 *
 */
type CommentsProcessed = {
  id: string
  fileName: string
  filePath: string
  comments: CommentsRaw
  modifiedDate: Date
  createdDate: Date
}


//------------------------------------------------------------------------------
//-- JsonToUi

/**
 * @type {Type} Comments
 * @typedef Comments
 * @memberof module:build-docs.types.comments
 * @memberof module:build-docs.DocsToJson
 * @summary Used by JsonToUi to render the documentation.
 * @description Takes data using typedef `CommentsRaw`, and processes it into a more usable format.
 * @prop {string} id - The unique identifier for the file. Generated by crypto.randomUUID()
 * @prop { 'public' | 'private' | 'protected' | null } access - The access level of the item. Can be null, public, private, or protected.
 *
 *
 * @changelog 2023-07-17 | Erik Plachta | Add more complete content.
 * @changelog 2023-07-18 | Erik Plachta | Finalize concept.
 *
 * @todo  2023-07-18 | Erik Plachta | Add Summary, Description, and params.
 */
type Comments = {
  id: string
  access: 'public' | 'private' | 'protected' | null | string
  summary: string | null
  description: string | null

  //-- type of item.
  type: {
    type: string // between `{}`
    description: string // after `}` and sometimes `-`
  } | null

  author?: string | null
  license?: string | null
  version?: string | null
  changelog: void | string[]

  returns?: {
    type: string // between `{}`
    description: string // after `-`
  }

  throws?: {
    type: string // between `{}`
    description: string // after `-`
  }
  example: void | string[]
  related?: string[]
  see?: string[]

  todo?: void | string[]

  bug?: void | string[]

  arguments:
    | {
        id: CommentsProcessed['id']
        type: string | null // between `{}`
        name: string | null // between `[]`
        description: string | null // after `-`
      }[]
    | void

  requires:
    | {
        id: string
        type:
          | string
          | 'module'
          | 'node-module'
          | 'namespace'
          | 'function'
          | null //-- before `:`
        name: string | null // after `:` and before `-`
        description: string | null // after `-`
      }[]
    | void

  props:
    | {
        id: string
        type: string | null // between `{}`
        name: string | null // between `[]`
        description: string | null // after `-`
      }[]
    | void

  // Managed by JsonToUi to determine if item is a root item or not.
  isRootItem: boolean

  fileDetails: {
    // All return this even if not file
    fileName: string
    filePath: string
    createdDate: Date
    modifiedDate: Date
  }

  namespaces: string[]
  modules: string[]

  memberOf?: {
    type: string
    description: string
  }[]

  // isClass: boolean;
  // isModule: boolean;
  parent: {
    id: CommentsProcessed['id']
    type: string | null
    association: 'namespace' | 'module' | 'file' | string
    description?: string
  }[]
  children: {
    id: CommentsProcessed['id']
    type: string | null
    association: 'namespace' | 'module' | 'file' | string
    description?: string
  }[]
  // dataToRender: dataToRender;

  // Optionally add the original doc object for debugging.
  comments?: Comments
}

export {
  CommentRaw,
  CommentsRaw,
  CommentParsed,
  CommentsParsed,
  CommentsProcessed,
  Comments
}
