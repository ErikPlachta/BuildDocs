


/**
 * @type {Type} ProcessedDataItem
 * @typedef ProcessedDataItem
 * @memberof module:Types
 * @memberof module:DocsToJson
 * @summary Extracted details from a comment block to be used to build documentation.
 * @description The details of a file.
 * @prop {string} id - The unique identifier for the file. Generated by crypto.randomUUID()
 * @prop { 'public' | 'private' | 'protected' } access - The access level of the item. Can be null, public, private, or protected.
 * 
 * 
 * @changelog 2023-07-17 | Erik Plachta | Add more complete content.
 * @changelog 2023-07-18 | Erik Plachta | Finalize concept.
 * 
 * @todo  2023-07-18 | Erik Plachta | Add Summary, Description, and params.
 */
type ProcessedDataItem = {
  id: string
  access: 'public' | 'private' | 'protected'
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
        id: ProcessedDataItem['id']
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
    createdDate: string
    modifiedDate: string
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
    id: ProcessedDataItem['id']
    type: string | null
    association: 'namespace' | 'module' | 'file' | string
    description?: string
  }[]
  children: {
    id: ProcessedDataItem['id']
    type: string | null
    association: 'namespace' | 'module' | 'file' | string
    description?: string
  }[]
  // dataToRender: dataToRender;

  // Optionally add the original doc object for debugging.
  doc?: Doc
}

export { ProcessedDataItem }