/**
 * @module build-docs.types.elements
 * @export Elements
 * @export Element
 * @version 0.0.1
 */

import { CommentsProcessed } from './index'

/**
 * @typedef Element
 * @version 0.0.2
 * @since 2023-07-14
 * @access public
 * @memberof module:build-docs.types.elements
 * @summary Type definition for data to be rendered to the UI.
 * @description Type definition for all elements to be rendered, including the meta data and the HTML Data Attribute Values for grouping content.
 * @changelog 0.0.1 | 2023-07-14 | Created concept which will be used to render UI content.
 * @changelog 0.0.2 | 2023-07-17 | Finalized concept and verified works with content generation.
 */
type Element = {
  //-- DOM ID for the element.
  id: string
  //-- If there is a parent ID, it's to be here.
  parent: string | null
  //-- If this element has children elements, they'll be rendered here.
  children: Element[]

  //-- Optional placeholder to be displayed when no content is present for tooltips, etc.
  description?: string

  //-- The role of the item within the content itself.
  elementType: ElementType

  helpers: {
    getChildren: () => Element[]
    // getChildrenByType: (type: string) => Element[],
    // getChildrenByRole: (role: string) => Element[],
    // getChildrenByGroup: (group: string) => Element[],
    // getChildrenBySubGroup: (subGroup: string) => Element[],
    // getChildrenByParent: (parent: string) => Element[],
  }

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

  //-- Organizational attributes for content being rendered
  dataAttributes: {
    //-- What's to be displayed.
    value: null | string | CommentsProcessed
    type: null | string | CommentsProcessed['type']
    path: null | string //-- location of item in content for reference.

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
}

/**
 * Used for rendering HTML elements.
 */
type ElementType =
  | string
  | 'li'
  | 'section'
  | 'div'
  | 'span'
  | 'a'
  | 'button'
  | 'input'
  | 'textarea'

type Parents = {
  main: string
  headerNav: string
  headerNavLinks: string
  container: string
  tabStripNav: string
  contentWrapper: string
}

/**
 * @typedef Elements
 * @version 0.0.1
 * @since 2023-07-17
 * @access public
 * @memberof module:build-docs.types.elements
 * @summary Type definition for an element to be rendered to the UI.
 * @description For each code-block, this Type is used for the collection of elements generated.
 */
type Elements = {
  // -- the ID of the root item in processed data
  id: string
  parents: Parents
  //-- date the data was generated
  createdDate: Date

  //-- Id's for parent containers generated at time of execution
  

  //-- Based data for the comment block.
  data?: {
    // item: CommentsProcessed //TODO: uncomment and keep full item here or remove this.
    arguments: CommentsProcessed['arguments'] | []
    props: CommentsProcessed['props'] | []
    returns: CommentsProcessed['returns'] | []
    requires: CommentsProcessed['requires'] | []
    changelog: CommentsProcessed['changelog'] | []
    parent: CommentsProcessed['parent'] | null
    children: CommentsProcessed['children'] | []
    related: CommentsProcessed['related'] | []
  }
  //-- Array of Objects which are elements to be rendered
  Elements?: Element[]
}

/**
 * @typedef ElementsProcessed
 * @memberof module:build-docs.types.elements
 * @summary Used by `JsonToUi.buildElements()` to generate all Elements.
 */
type ElementsProcessed = {
  id: string
  createdDate: Date
  parents: Parents
  Elements: Elements[]
}

//-- Exporting types
export { Element, Elements, ElementsProcessed }
