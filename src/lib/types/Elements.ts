import { CommentsProcessed } from './index'

type ElementsProcessed = {
  id: string
  createdDate: Date
  description : string
  HtmlElements: Elements[]
  parents: Parents
  helpers: {
    getElements: () => Elements[]
    getElementById: (id: string) => Elements[]
    getElementsById: (id: string) => Elements[]
    getElementsByParentId: (parent: string) => Elements[]
    getElementsByRole: (role: string) => Elements[]
    getElementsByGroup: (group: string) => Elements[]
    getElementsBySubGroup: (subGroup: string) => Elements[]
    getElementsByType: (type: string) => Elements[]
  }
}

type Elements = {
  id: string
  title : string
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
  helpers: {
    getChildren: () => Element[]
  }
  defaults?: {
    isDisabled?: boolean
    isSelected?: boolean
    isExpanded?: boolean
    isCollapsed?: boolean
    isHidden?: boolean
    isLocked?: boolean
    isEditable?: boolean
  }
  dataAttributes: {
    value: null | string | CommentsProcessed
    type: null | string | CommentsProcessed['type']
    path: null | string
    role: null | string | 'nav-header' | 'nav-header-link' | 'container' | 'content' | 'tab-strip' | 'tab-strip-nav' | 'tab-strip-nav-link'
    group: null | string | 'overview' | 'changelog' | 'about'
    subGroup: null | string
    active ?:  boolean
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


type htmlConfig = {
  html: {
    lang: string
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

export { Element, Elements, ElementsProcessed, htmlConfig }


