/**
 * @access private
 * @file JsonToUi\index.ts
 * @summary Contains class for converting JSON data generated by BuildDocs module into markdown and/or HTML.
 * @namespace {build-docs.JsonToUi}
 * @module JsonToUi
 * @memberof namespace:build-docs
 * @changelog 0.0.1 | 2023-07-13 | Erik Plachta | Initial version
 * @changelog 0.0.2 | 2023-07-14 | Erik Plachta | Built out more complete data extraction
 * @changelog 0.0.3 | 2023-07-15 | Erik Plachta | Finalized data extraction for building HTML. Add files,
 *
 */

import {
  Comment,
  Comments,
  CommentsRaw,
  CommentsProcessed,
  Namespace,
  Module,
  File,
  JsonToUiConfig,
  Elements,
  Element,
} from '../types'
import { randomUUID } from 'crypto'

/**
 * @access private
 * @class
 * @memberof module:JsonToUi
 * @summary Converting JSON data generated by BuildDocs module into markdown and/or HTML.
 * @param {DataItem[]} data - The JSON data to convert
 * @param {Config} config - The configuration for the conversion
 * @todo 2023-07-15 | Erik Plachta | Add more complete config options
 * @todo 2023-07-15 | Erik Plachta | Add html generation
 * @todo 2023-07-15 | Erik Plachta | Add markdown generation
 */
/**
 * Class to convert JSON data to Markdown and HTML
 */
class JsonToUi {
  commentsRaw: CommentsRaw[]
  files: File[]
  namespaces: Namespace[]
  modules: Module[]
  processedData: CommentsProcessed[] | []
  rootItems: CommentsProcessed[] | []
  elements: Elements
  config: JsonToUiConfig

  /**
   * @access private
   * @constructor
   * @summary When class instantiated, process data and build elements.
   * @param {Comments[]} comments - The JSON data object containing all comment info to converted.
   * @param {Config} config - The configuration for the conversion.
   */
  constructor(
    commentsRaw: CommentsRaw[],
    //TODO: onboard this.
    config: {
      convertToMarkdown: boolean
      convertToHtml: boolean
    },
  ) {
    this.commentsRaw = commentsRaw
    this.config = config
    this.files = []
    this.namespaces = []
    this.modules = []
    this.processedData = this.processComments(commentsRaw)

    //-- All top-level items that represent a group of info. (Ex, the file that contains a class, functions, etc)
    this.rootItems = this.getRootItems()
    //-- Evaluate `this.processedData` and `this.rootItems`, assign `ContentToRender` values.
    this.elements = this.buildElements()
  }

  //----------------------------------------------------------------------------
  /**
   * Process data for easier use
   * @param {Comments[]} comments - The data to process
   * @return {CommentsProcessed[]} The processed data
   */
  processComments(comments: CommentsRaw[]): CommentsProcessed[] {
    const processedData: CommentsProcessed[] = []

    //-----------------------------
    // 1. First pass through all items to extract individual doc info.
    comments.map((item: CommentsRaw) => {
      processedData.push({
        id: item.id,

        //-- if it's got a namespace it's a root item.
        isRootItem: item.comments?.namespace?.[0]?.description ? true : false,

        fileDetails: {
          //-- All return this even if it's not a file because it's relational reference.
          fileName: item.fileName,
          filePath: item.filePath,
          createdDate: item.createdDate,
          modifiedDate: item.modifiedDate,
        },

        type: item.comments?.type?.[0]?.description
          ? {
              type: item.comments?.type?.[0]?.description
                .split('}')[0]
                .replace('{', ''),
              description: item.comments?.type?.[0]?.description
                .split('}')[1]
                .trim(),
            }
          : item.comments?.file?.[0]?.description
          ? {
              type: 'file',
              description: item.comments?.file?.[0]?.description,
            }
          : null,

        version: item.comments?.version?.[0]?.description
          ? item.comments?.version?.[0]?.description
          : null,

        author: item.comments?.author?.[0]?.description
          ? item.comments?.author?.[0]?.description
          : null,

        access: item.comments?.access?.[0]?.description
          ? item.comments?.access?.[0]?.description
          : null,

        description: item.comments?.description?.[0]?.description
          ? item.comments?.description?.[0]?.description
          : null,

        summary: item.comments?.summary?.[0]?.description
          ? item.comments?.summary?.[0]?.description
          : null,

        props:
          item.comments?.param?.length > 0
            ? item.comments.param.map(param => {
                const args = param.description.match(
                  /(\{[^}]*\}|\[[^\]]*\]|`[^`]*`|[^ ]+)/g,
                )
                const [type, name, ...description] = args || []

                return {
                  id: item.id,
                  type: type?.replace('{', '').replace('}', '') || null,
                  name: name?.replace('[', '').replace(']', '') || null,
                  description: description?.join(' ').replace('-', '') || null,
                }
              })
            : [],

        arguments:
          item.comments?.argument?.length > 0
            ? item.comments?.argument.map(argument => {
                const args = argument.description.match(
                  /(\{[^}]*\}|\[[^\]]*\]|`[^`]*`|[^ ]+)/g,
                )
                const [type, name, ...description] = args || []

                return {
                  id: item.id,
                  type: type?.replace('{', '').replace('}', '') || '',
                  name: name?.replace('[', '').replace(']', '') || '',
                  description: description?.join(' ').replace('-', '') || '',
                }
              })
            : [],

        changelog:
          item.comments?.changelog?.length > 0
            ? item.comments?.changelog.map(changelog => {
                return changelog?.description
              })
            : [],

        todo:
          item.comments?.todo?.length > 0
            ? item.comments?.todo.map(todo => {
                return todo?.description
              })
            : [],

        bug:
          item.comments?.bug?.length > 0
            ? item.comments?.bug.map(bug => {
                return bug?.description
              })
            : [],

        example:
          item.comments?.example?.length > 0
            ? item.comments?.example.map(example => {
                return example?.description
              })
            : [],

        //-----------------------------
        //-- Creating empty values for the below, which will be populated on next pass.
        parent: [],
        children: [],

        //-----------------------------
        //-- Extract description from comment for namespace(s)
        namespaces:
          item.comments?.namespace?.length > 0
            ? item.comments?.namespace.map(namespace => {
                //-- Cleanup description to prepare to record
                const description = namespace?.description
                  .replace('{', '')
                  .replace('}', '')

                //-- Record namespace if isn't already defined in global state.
                // ( Should never create duplicates either way, but just in case. )
                if (
                  this.namespaces.filter(
                    item => description !== item.description,
                  ).length === 0
                ) {
                  this.namespaces.push({
                    id: item.id,
                    description: description,
                  })
                }

                //-- return object for the item itself as a value for the `namespaces` property.
                return description
              })
            : [],

        //-----------------------------
        //-- Extract description from comment for module(s)
        modules:
          item.comments?.module?.length > 0
            ? item.comments?.module.map(thisModule => {
                const value = thisModule.description
                this.modules.push({
                  id: item.id,
                  description: value,
                })
                return value
              })
            : [],

        //-----------------------------
        memberOf:
          item.comments?.memberof?.length > 0
            ? item.comments?.memberof.map(memberof => {
                const value = memberof?.description.split(':')
                return {
                  type: value[0],
                  description: value[1],
                }
              })
            : [],

        requires:
          item.comments?.requires?.length > 0
            ? item.comments?.requires.map(require => {
                const rootDesc = require.description
                const { type, name, description } = rootDesc.includes(
                  'https://nodejs.org/api',
                )
                  ? //-- Node Module
                    {
                      type: 'node-module',
                      name: rootDesc.split(' | ')[1]?.replace('}', ''),
                      description: rootDesc
                        .split('{@link ')[1]
                        ?.split(' | ')[0],
                    }
                  : rootDesc.split(':')[0].includes('module')
                  ? //-- Custom Module
                    {
                      // id: item?.id || null,
                      type: rootDesc.split(':')[0],
                      name: rootDesc.split(':')[1],
                      description: rootDesc.split(':')[1],
                    }
                  : //-- Everything else that isn't programmed in yet.
                    {
                      // id: item?.id || null,
                      type: 'unknown', //TODO: update this
                      name: null,
                      description: rootDesc,
                    }
                return {
                  id: item.id,
                  type: type || null,
                  name: name || null,
                  description: description || null,
                }
              })
            : [],
      })
    })

    // 2. Second  pass to add associations between items, recording files, etc
    processedData.map((item: CommentsProcessed) => {
      // 2.1. if has an @memberof tagging.
      if (item?.memberOf && item?.memberOf?.length > 0) {
        item.memberOf.map(memberOf => {
          //-----------------
          // 1.1 Assign relationships for namespaces
          if (memberOf.type === 'namespace') {
            this.namespaces.map(thisNamespace => {
              if (thisNamespace.description === memberOf.description) {
                //-- Add the parent id as the parent to the children
                item.parent.push({
                  id: thisNamespace.id,
                  type: item?.type?.type || null,
                  association: 'namespace',
                  description: thisNamespace.description,
                })
              } else {
                //TODO: onboard or remove this logic.
                // console.log('thisNamespace.value, memberOf.value', thisNamespace.value, memberOf.value)
                const allMemberValues = memberOf?.description.split(' | ') || []
                // const match = allMemberValues.filter((value) => { value === thisNamespace.value })
                const allNamespaceValues =
                  thisNamespace.description.split(' | ') || []
                // const match = allNamespaceValues.filter((value) => { value === memberOf.value })
              }
            })
          }

          //-----------------
          // 1.2. Assign relationships for modules
          if (memberOf.type === 'module') {
            //-- Loop through all modules, check to see if the item is a member of the module.
            this.modules.map(thisModule => {
              if (thisModule.description === memberOf.description) {
                //-- Add the parent id as the parent to the children
                item.parent.push({
                  id: thisModule.id,
                  type: item?.type?.type || null,
                  association: 'module',
                  description: thisModule.description,
                })

                //-- Find the parent and assign the child id to it
                processedData.map((parentItem: CommentsProcessed) => {
                  if (parentItem.id === thisModule.id) {
                    parentItem.children.push({
                      id: item.id,
                      type: item.type?.type || null,
                      association: 'module',
                      description: thisModule.description,
                    })
                  }
                }) // end of adding children associations for parent members of modules
              } // end of module names match
            }) // end of checking match for module names
          } //-- end of checking if memberOf.type === 'module'
        }) //-- end of looping through all memberOf
      } //-- end of checking if item.memberOf.length > 0

      //------------------------------------------------------------------
      // 2.2 If item is a file append this.files array. (children added after this loop)
      if (
        item.type?.type &&
        item.type.type == 'file' &&
        item.type?.description &&
        item.type?.description != (undefined || null)
      ) {
        this.files.push({
          id: item.id,
          description: item.type.description,
          filePath: item.fileDetails.filePath,
        })
      }
    }) //-- end of looping through all processedData

    // 3. If item is NOT a Root Item, add it's parent file to the files parent array.
    processedData.map((item: CommentsProcessed) => {
      if (item?.isRootItem != true) {
        // 3.1 If item is NOT a Root Item, add it's parent file to the files parent array.
        this.files.map(file => {
          if (file.filePath === item.fileDetails.filePath) {
            item.parent.push({
              id: file.id,
              type: item?.type?.type || null,
              association: 'file',
              description: file.description,
            })
          }
          // 3.2 Make sure proper parent association
          else {
            let fileToUpdate: any = processedData.filter(CommentsProcessed => {
              CommentsProcessed.id === file.id
            })
            //-- If there is a file, and there is not already an entry for it, add it.
            if (
              fileToUpdate.children &&
              fileToUpdate.children.filter((child: any) => child.id !== item.id)
            ) {
              fileToUpdate.children.push({
                id: item.id,
                type: 'file',
                description: file.description,
              })
            }
          }
        })
      }
    }) //-- end of looping through all processedData

    return processedData
  }

  //--------------------------------------------------------------------------
  //--------------------------------------------------------------------------
  //-- Building Content associations based on processed results:

  /**
   * @summary Take `this.rootItems` and build `ContentToRender` object.
   * @memberof module:JsonToUi
   * @returns {boolean} True if successful, false if not.
   */
  getRootItems(): CommentsProcessed[] | [] {
    try {
      //-- Get the root items
      const rootItems = this.processedData?.filter((item:CommentsProcessed) => {
        if (
          // item.parent.length === 0 ||
          item.isRootItem == true
        ) {
          return item
        }
      })

      return rootItems
    } catch (error) {
      console.error(error)
      return []
    }
  }

  getItemsByParent(parent: string): CommentsProcessed[] | undefined | boolean {
    try {
      //-- Get the root items
      const items = this.processedData?.filter((item: CommentsProcessed) => {
        if (item.parent.length > 0) {
          item.parent.map(parent => {
            if (parent.id === item.id) {
              return item
            }
          })
        }
      })

      return items
    } catch (error) {
      console.error(error)
      return false
    }
  }

  //----------------------------------------------------------------------------
  //--

  /**
   *
   * @return {array[object]} - An array of objects, each containing the id of the element, the id of the processed item it relates to, and the data to render.
   */
  buildElements(): Elements {
    // 1. Create an array to hold the elements
    let elements: Elements = {
      created: new Date(),
      comments: [],
    }

    //TODO: 2023-07-17 | Erik Plachta | Onboard this below once decide to use like this or remove.
    const headerId = randomUUID()
    const mainId = randomUUID()

    // 2. Loop through all Root Items and generate base content.
    // this.rootItems != undefined &&
    this.rootItems.map((item: CommentsProcessed) => {
      let headerNavLinkId = randomUUID()
      let containerId = randomUUID()
      let tabStripNavId = randomUUID()
      let contentWrapperId = randomUUID()

      elements.data.push({
        id: item.id, //-- The ID of the raw json data all content is being rendered from.
        //-----------------
        // 2.1 - Get all root data for reference.
        data: {
          // item: item,
          //-- data to reference when building content.
          changelog: item.changelog,
          props: item.props,
          arguments: item.arguments,
          returns: item.returns,
          requires: item.requires,
          parent: item.parent,
          children: item.children,
        },
        //-----------------
        //-- 2.2 Array of all content to be rendered
        ContentToRender: [
          //-------------
          // 2.2.1 - header-nav-link
          {
            id: headerNavLinkId,
            parent: 'nav-header',
            description:
              'Container that holds navigation to toggle what is visible within the main section.',
            //-- Used for Classifications, special behaviors, etc. (In HTML, used to create attributes, starting with `data-`.)

            attributes: {
              value: item.namespaces[0],
              role: 'nav-header-link', //-- Role of content when rendered to the UI.
              group: item.namespaces[0], //-- High-level association of content in nav-header to the main container. Each Root item should only have 1.
              subGroup: item.modules[0], //-- Primary module that's running the show.
              id: item.modules[0], //-- Unique ID to connect tab-strip-nav to it's related content to display. For example, `overview-summary` is the id for the overview tab and the overview content.
            },
            children: [],
            getChildren: () => {
              let navHeaderLinks: ContentToRender[] = []

              //!! TODO: Pick up here, by getting all child elements and managing accordingly. Then to go through each.
              this.rootItems.forEach(rootItem => {
                let relatedChildren: ContentToRender[] = []
                let relatedRequires: ContentToRender[] = []
                // rootItem.children.forEach(child => {})
                rootItem.requires &&
                  rootItem.requires.forEach(entry => {
                    this.processedData.map(each => {
                      if (entry.id == each.id) {
                        relatedRequires.push({
                          id: randomUUID(),
                          parent: tabStripNavId,
                          type: 'li',
                          attributes: {
                            // type: rootItem?.type?.type, //
                            value: rootItem.modules[0],
                            role: 'tab-strip-nav-link',
                            group: rootItem.namespaces[0],
                            subGroup: rootItem.modules[0],
                            id: `${rootItem.modules[0]}-tab`,
                          },
                          children: [],
                          getChildren: () => [],
                        })
                      }
                    })
                  })

                navHeaderLinks.push({
                  id: randomUUID(),
                  parent: tabStripNavId,
                  type: 'li',
                  attributes: {
                    value: rootItem.modules[0],
                    type: rootItem?.type?.type,
                    role: 'tab-strip-nav-link',
                    group: rootItem.namespaces[0],
                    subGroup: rootItem.modules[0],
                    id: `${rootItem.modules[0]}-tab`,
                  },
                  children: [],
                  getChildren: () => [],
                })
              })

              return [...navHeaderLinks]
            },
          },
          //-------------
          // 2.2.2 - container - Each Root Item has a container element. Is visible when selected via main navigation.
          {
            id: containerId,
            parent: 'main',
            description:
              'Container that holds ALL content for all Root Items to be displayed, based on the selection within nav-header.',
            type: 'div',
            attributes: {
              value: null,
              role: 'container',
              group: item.namespaces[0],
              subGroup: null,
              id: `container-${item.namespaces[0]}`,
            },

            children: [],
            //-- Populate Children and Children's children for TabStrip
            getChildren: () => {
              //TODO: build elements dynamically
              //-- TabStrip Wrapper and then tabs.
              const tabStripNavElements: ContentToRender[] = []
              tabStripNavElements.push({
                id: tabStripNavId,
                parent: containerId,
                type: 'nav',
                attributes: {
                  value: null,
                  role: 'tab-strip-nav',
                  group: item.namespaces[0],
                  subGroup: null,
                  id: `tab-strip-${item.namespaces[0]}`,
                },
                children: [],
                getChildren: () => {
                  //-- Map thru all child elements
                  const childrenElements: ContentToRender[] = []

                  item.children.map(child => {
                    const thisElement = this.processedData.filter(
                      entry => entry.id == child.id,
                    )[0]

                    if (thisElement) {
                      childrenElements.push({
                        id: randomUUID(),
                        parent: tabStripNavId,
                        type: thisElement?.type?.type,
                        attributes: {
                          value: null,
                          role: 'tab-strip-nav-link',
                          group: item.namespaces[0],
                          subGroup: item.modules[0],
                          id: `${item.modules[0]}-tab`,
                        },
                        children: [],
                        getChildren: () => [],
                      })
                    }
                  })

                  const childNavElements: ContentToRender[] = [
                    {
                      id: randomUUID(),
                      parent: tabStripNavId,
                      attributes: {
                        value: null,
                        role: 'tab-strip-nav-link',
                        group: item.namespaces[0],
                        subGroup: item.modules[0],
                        id: `${item.modules[0]}-tab`,
                      },
                      children: [],
                      getChildren: () => [],
                    },
                  ]

                  return [...childrenElements]
                },
              })

              //-- Populate CHildren Content
              const contentWrapper: ContentToRender[] = []
              contentWrapper.push(
                // 2.2.4 - Content Wrapper (element after tab-strip-nav that  holds all content)
                {
                  id: randomUUID(),
                  parent: containerId,
                  attributes: {
                    value: null,
                    role: 'content-wrapper',
                    group: item.namespaces[0],
                    subGroup: null,
                    id: `content-${item.namespaces[0]}`,
                  },
                  children: [],
                  getChildren: () => {
                    const contentElements: ContentToRender[] = []

                    // 2.2.5 - Content (Element that holds all content related.)
                    //TODO: Update so builds all, not just the one.
                    contentElements.push({
                      id: randomUUID(),
                      parent: contentWrapperId,
                      attributes: {
                        value: null,
                        role: 'content',
                        group: item.namespaces[0],
                        subGroup: null,
                        id: `content-${item.namespaces[0]}`,
                      },
                      children: [],
                      getChildren: () => {
                        const elementsInContent: ContentToRender[] = []
                        return elementsInContent
                      },
                    })

                    return contentElements
                  },
                },
              )
              return [...tabStripNavElements, ...contentWrapper]
            },
          },
        ],
      })
    })

    //---------------------------------
    // 3. Map through ALL Content to Render and make sure children are populated.

    // Recursively populate children of each ContentToRender element.
    function populateChildren(element: ContentToRender) {
      // Call getChildren method to populate children.
      if (element.hasOwnProperty('getChildren')) {
        element.children = element.getChildren()
      }

      // Recursively call populateChildren for each child.
      if (element.children) {
        element.children.forEach((child: ContentToRender) =>
          populateChildren(child),
        )
      }
    }

    // Call populateChildren for each ContentToRender in elements.data.
    elements.data.forEach((dataItem: Element) => {
      dataItem.ContentToRender.forEach((contentToRender: ContentToRender) =>
        populateChildren(contentToRender),
      )
    })

    // 4. Finally, return the elements array.
    return elements
  }

  //--------------------------------------------------------------------------
  /**
   * Convert the data to Markdown
   * @return {string} The Markdown string
   * @todo Implement the method
   */
  toMarkdown(): string {
    // Implement the method as before...
    return ''
  }

  /**
   * Convert the data to HTML
   * @return {string} The HTML string
   * @todo Implement the method
   */
  toHtml(
    title = 'Placeholder Title',
    subTitle = 'Placeholder subtitle for html.',
  ): string {
    return `${title} ${subTitle}`
    // const bodyStart = `<html>
    //         <head>
    //             <title>${title}</title>
    //             <meta charset="utf-8" />
    //             <meta name="viewport" content="width=device-width, initial-scale=1" />
    //             <script src="https://cdn.tailwindcss.com"></script>
    //         </head>
    //         <body class="bg-gray-100 flex flex-col gap-8">`;

    // const getMainNav = ""; //todo: build this out

    // const buildHeader = `<header class="w-full p-0 m-0 px-4 pt-4 border-solid border-2 bg-white flex flex-col gap-4 max-w-8xl mx-auto">
    // 		<div class="max-w-4xl mx-auto w-full">
    // 				<h1 class="text-blue-500 text-4xl">
    // 						${title}
    // 				</h1>
    // 				<p class="text-gray-400">
    // 						${subTitle}
    // 				</p>
    // 		</div>
    // 		<nav>
    // 			<ul class="flex flex-row gap-6 mt-auto h-full">
    // 					<li class="py-2 px-4 border-solid border-b-4 border-blue-500 hover:border-blue-500/80"
    // 							data-role="nav-main"
    // 							data-group="overview"
    // 					>
    // 							<a href="#overview">Overview</a>
    // 				</li>` +
    // 		getMainNav() +
    // 		`</ul>
    // 		</nav>
    // 	</header>`
    // ;
  }
}

module.exports = JsonToUi
