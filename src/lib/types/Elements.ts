/**
 * @module build-docs.types.Content
 * @export Elements
 * @export Element
 * @version 0.0.1
 */

import {ProcessedDataItem } from './index'

/**
 * @export
 * @interface Elements
 * @version 0.0.1
 * @since 2023-07-17
 * @access public
 * @memberof module:build-docs.types
 * @summary Type definition for an element to be rendered to the UI.
 * @description For each code-block, this Type is used for the collection of elements generated.
 */
export type Elements = {
  id: ProcessedDataItem['id']
  date: Date
  // parent: ProcessedDataItem['parent']

  //-- Based data for the comment block.
  data: {
    // item: ProcessedDataItem
    arguments: ProcessedDataItem['arguments']
    props: ProcessedDataItem['props']
    returns: ProcessedDataItem['returns']
    requires: ProcessedDataItem['requires']
    changelog: ProcessedDataItem['changelog']
    parent: ProcessedDataItem['parent']
    children: ProcessedDataItem['children']
  }
  //-- Array of Objects which are elements to be rendered
  Element: Element[]
}

/**
 * @export
 * @interface Element
 * @version 0.0.2
 * @since 2023-07-14
 * @access public
 * @memberof module:build-docs.types
 * @summary Type definition for data to be rendered to the UI.
 * @description Type definition for all elements to be rendered, including the meta data and the HTML Data Attribute Values for grouping content.
 * @changelog 0.0.1 | 2023-07-14 | Created concept which will be used to render UI content.
 * @changelog 0.0.2 | 2023-07-17 | Finalized concept and verified works with content generation.
 */
export type Element = {
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
    type: ProcessedDataItem['type']
    
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
  parent: Elements['id'] | null
  getChildren: () => Element[]
  children: Element[] | []
}
