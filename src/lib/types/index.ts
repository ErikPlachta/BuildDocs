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

export interface Comment {
  id?: string
  line: string
  type: string
  description: string
}

export interface Doc {
  [key: string]: Comment[]
}

export type DataItem = {
  id: string
  fileName: string
  filePath: string
  doc: Doc
  createdDate: string
  modifiedDate: string
  relatedComments: string[]
}

export type Namespace = {
  id: string
  description: string
}

export type Module = {
  id: string
  description: string
}

/**
 * @typedef {Object} ProcessedDataItem
 */
export interface ProcessedDataItem {
  id: string
  access: null | string | 'public' | 'private' | 'protected'
  summary: string | null
  description: string | null

  //-- type of item.
  type?: {
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
        id?: string
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

  params:
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

export type JsonToUiConfig = {
  convertToMarkdown: boolean
  convertToHtml: boolean
}

export type File = {
  id: string //-- randomUUID
  description: string //-- file name for reference
  filePath: string //-- for connecting all items to their file.
}

//------------------------------------------------------------------------------
//-- For rendering content to UI

/**
 * @export
 * @interface Elements
 * @version 0.0.1
 * @since 2023-07-17
 * @access public
 * @memberof module:build-docs.types
 * @summary Type definition for all elements to be rendered to the UI.
 */
export type Elements = {
  //-- Date time the element data was generated.
  created: Date
  //-- Array of data for all elements to be generated.
  data: Element[]
}

/**
 * @export
 * @interface Element
 * @version 0.0.1
 * @since 2023-07-17
 * @access public
 * @memberof module:build-docs.types
 * @summary Type definition for an element to be rendered to the UI.
 */
export type Element = {
  id: string
  // parent: ProcessedDataItem['parent']

  //-- Data that is used to generate all related content.
  data: {
    // item: ProcessedDataItem
    arguments: ProcessedDataItem['arguments']
    params: ProcessedDataItem['params']
    returns: ProcessedDataItem['returns']
    requires: ProcessedDataItem['requires']
    changelog: ProcessedDataItem['changelog']
    parent: ProcessedDataItem['parent']
    children: ProcessedDataItem['children']
    //-- Array of Objects which are elements to be rendered
  }

  ContentToRender: ContentToRender[]
}

/**
 * @export
 * @interface ContentToRender
 * @version 0.0.2
 * @since 2023-07-14
 * @access public
 * @memberof module:build-docs.types
 * @summary Type definition for data to be rendered to the UI.
 * @description Type definition for all elements to be rendered, including the meta data and the HTML Data Attribute Values for grouping content.
 * @changelog 0.0.1 | 2023-07-14 | Created concept which will be used to render UI content.
 * @changelog 0.0.2 | 2023-07-17 | Finalized concept and verified works with content generation.
 */
export type ContentToRender = {
  //-- DOM ID for the element.
  id: string

  description?: string

  //-- Array of Objects which are elements to be rendered
  // Default configuration for content.
  defaults?: {
    isDisabled?: boolean
    isSelected?: boolean
    isExpanded?: boolean
    isCollapsed?: boolean
    isHidden?: boolean
    isLocked?: boolean
    isEditable?: boolean
  }

  //-- The role of the item within the content itself.
  type?: null | string | 'function' | 'const' | 'class' | 'file'
  //-- The definition after the @type tag, if any.
  typeDescription?: null | string

  //-- Organizational attributes for content being rendered
  attributes: {
    //-- What's to be displayed.
    value: null | string

    //-- Role of content when rendered to the UI.
    role:
      | null
      | string
      | 'nav-header' //-- Header navigation for the page
      | 'nav-header-link' //-- Link within main navigation in header
      | 'container' //-- wrapper around content
      | 'content' //-- wrapper around information to be rendered
      | 'tab-strip' //-- wrapper around whole tab-strip
      | 'tab-strip-nav' //-- the UL around the nav links
      | 'tab-strip-nav-link' //-- Each tab link in the UL

    //-- High-level association of content in nav-header to the main container.
    group: null | string | 'overview' | 'changelog' | 'about'

    //-- Category of content. ( to get all stats for all module could query this.)
    subGroup: null | string // 'stats'

    //-- Unique ID to connect tab-strip-nav to it's related content to display. For example, `overview-summary` is the id for the overview tab and the overview content.
    id: null | string
  }

  //-- The ID of the parent element
  parent: ContentToRender['id'] | null
  //-- Array of all children content
  getChildren: () => ContentToRender[]
  children: ContentToRender[] | []
  // children?: () => ContentToRender[] | []
}
