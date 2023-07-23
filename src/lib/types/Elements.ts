import { CommentsProcessed } from './index'

/**
 * Used within `Elements` to define how the content will be rendered.
 * @memberof module:build-docs.types.elements
 * @typedef Elements
 * @summary Wrapper around extracted comments from file, prepared for rendering to ui.
 * @description
 */
type ElementsProcessed = {
  id: string
  createdDate: Date
  description: string
  HtmlElements: Elements[]
  //TODO: Onboard this.
  MarkdownElements?: Elements[]
  parents: Parents
  helpers?: Helpers
}

type Elements = {
  id: string
  title: string
  description: string
  parents: Parents
  createdDate: Date
  data?: {
    arguments: CommentsProcessed['arguments'] | []
    props: CommentsProcessed['props'] | []
    returns: CommentsProcessed['returns'] | []
    requires: CommentsProcessed['requires'] | []
    changelog: CommentsProcessed['changelog'] | []
    parent: CommentsProcessed['parent'] | null
    children: CommentsProcessed['children'] | []
    related: CommentsProcessed['related'] | []
  }
  Elements: Element[]
}

type Element = {
  id: string | null
  orderId?: number
  parent: string | null
  children: Element[]
  description?: string
  elementType: ElementType
  helpers?: Helpers
  defaults?: {
    isDisabled?: boolean
    isSelected?: boolean
    isExpanded?: boolean
    isCollapsed?: boolean
    isHidden?: boolean
    isLocked?: boolean
    isEditable?: boolean
  }
  content?: string[] | any[] // Content to be rendered
  dataAttributes: {
    value: null | string | CommentsProcessed
    type: null | string | CommentsProcessed['type']
    path: null | string
    role:
      | null
      | string
      | 'nav-header'
      | 'nav-header-link'
      | 'container'
      | 'content'
      | 'tab-strip'
      | 'tab-strip-nav'
      | 'tab-strip-nav-link'
    group: null | string | 'overview' | 'changelog' | 'about'
    subGroup: null | string
    active?: boolean
    id: null | string
  }
  classList: string[]
}

type ElementType = string | 'li' | 'section' | 'div' | 'span' | 'a' | 'button' | 'input' | 'textarea'

type Parents = {
  body: string
  header: string
  navHeader: string
  navHeaderList: string
  main: string
  contentWrapper: string
  tabStripNav?: string
  tabStripNavList?: string
  container?: string
  footer: string
}

/**
 * Utility functions for withing with processed elements.
 *
 * @type {Type} Helpers
 * @access public
 * @summary Utility functions for withing with processed elements.
 * @memberof module:build-docs.types.elements
 * @typedef Helpers
 *
 * @prop {function} getElements - Get all elements.
 *
 * @todo 2023-07-23 | Erik Plachta | Onboard these once the concept is more complete.
 */
type Helpers = {
  html?: {
    get?: {
      activeTab?: () => string
      activeGroup?: () => string
      activeSubGroup?: () => string
      lastActiveTab?: () => string

      elements?: () => Elements[]
      elementById?: (id: string) => Elements[]
      elementsById?: (id: string) => Elements[]
      elementsByParentId?: (parent: string) => Elements[]
      elementsByRole?: (role: string) => Elements[]
      elementsByGroup?: (group: string) => Elements[]
      elementsBySubGroup?: (subGroup: string) => Elements[]
      elementsByType?: (type: string) => Elements[]
    }
  }
}

type htmlConfig = {
  html: {
    lang: string
    classList: string[]
  }
  head: {
    scripts: htmlScript[]
    styles: htmlStyle[]
    meta: htmlMeta[]
  }
  body: {
    styles: string[]
    classList: string[]
  }
}

type htmlScript = {
  src?: string
  async?: boolean
  defer?: boolean
  module?: boolean
  value?: string
}

type htmlStyle = {
  type: CSSStyleRule
  value: CSSStyleValue
}

type htmlMeta = {
  type: string | 'charset' | 'name' | 'http-equiv' | 'content' | 'property'
  value: string
}

/**
 * Used within `Element` to define how the content will be rendered within HTML.
 *
 * @todo 2023-07-23 | Erik Plachta | Onboard these once the concept is more complete.
 */
type htmlContent = {
  type: 'text' | 'list' | 'title' | 'description' | 'code' | 'link' | 'button' | 'input' | 'textarea'
  value: string | string[] | object | object[]
  classList: string[]
  //?? anything else?
}

export { Element, Elements, ElementsProcessed, htmlConfig }
