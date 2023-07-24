import { htmlConfig, ElementsProcessed, Logging_config } from '../../types'
import { JSDOM } from 'jsdom'

/**
 * Called by `DocsToUi` to generate HTML from the JSON data.
 *
 * @access private
 * @class BuildHtml
 * @memberof module:DocsToUi
 * @memberof namespace:build-docs.DocsToUi
 * @module BuildHtml
 * @requires JSDOM
 * @requires module:DocsToUi~htmlConfig
 * @requires module:DocsToUi~ElementsProcessed
 * @summary Called by `DocsToUi.` to generate HTML from the JSON data.
 * @description a recursive function that takes an element and its parent as parameters. It creates an HTML element based on the elementType property of the input element, sets its attributes and classes, and appends it to the parent element.
 * @version 0.0.4
 * @author Erik Plachta
 * @since 0.0.1
 * @changelog 0.0.1 | 2023-07-22 | Generated concept within DocsToUi
 * @changelog 0.0.2 | 2023-07-22 | Converted to module due to size and complexity.
 * @changelog 0.0.3 | 2023-07-22 | Updated to a Class object and refined.
 * @param {ElementsProcessed} elements - The elements to be rendered.
 * @param {string} title - The title of the document.
 * @param {HtmlConfig} htmlConfig - The configuration object for the each section within the HTML document.
 * @param {boolean} DEBUG - Optional param to enable debugging. If true, will output debug information to the console.
 * @return {string} - The complete HTML document.
 */
class BuildHtml {
  private LogLevel: Logging_config['level']['value']
  private dom: JSDOM = new JSDOM(`<!DOCTYPE html>`) // Create a new JSDOM instance and get the document from it.
  private document: Document = this.dom.window.document
  private elements: ElementsProcessed
  private title: string = 'No-Title-Set' // Default title.
  private htmlConfig: htmlConfig
  private resultsIfError: (error: string) => string
  public results: string | undefined

  constructor(
    LogLevel: Logging_config['level']['value'],
    elements: ElementsProcessed,
    title: string,
    htmlConfig: htmlConfig,
  ) {
    this.LogLevel = LogLevel
    this.elements = elements
    this.title = title
    this.htmlConfig = htmlConfig
    this.results = undefined
    this.resultsIfError = (error: string) =>
      `<!DOCTYPE html><html lang="en"><head><title>ERROR</title></head><body><h1>ERROR</h1><p>${error}</p></body></html>`
  }

  /**
   * Builds the HTML document.
   *
   * @type {function} build
   * @function build
   * @access public
   * @memberof module:DocsToUi
   * @summary Called by JsonToUi to generate the HTML document.
   * @description Primary class method to generate HTML from the JSON data.
   */
  async build(): Promise<string> {
    try {
      // Deconstruct the htmlConfig object.
      const { head, body } = this.htmlConfig

      // 1. Set head config.
      this.buildHead(head)
      // 2. Set body config.
      this.buildBody(body)
      // 3. Build content within body.
      let buildContentResults = await this.buildContent()
      
      // If there was an error, return the error.
      if(this.LogLevel > 1) console.log('buildContentResults', buildContentResults)

      // Add a line break to the end of the body so closing tag on new line.
      this.document.body.innerHTML = this.document.body.innerHTML + `\n`

      // Returns results back to this.getHtml()
      return `<!DOCTYPE html>\n ${this.document.documentElement.outerHTML}`
    } catch (error) {
      if (this.LogLevel > 1) {
        console.log(error)
      }

      return this.resultsIfError(error as string)
    }
  }

  //----------------------------------------------------------------------------
  //-- Utility Functions

  // 1. Build the head content
  private async buildHead(head: htmlConfig['head']) {
    try {
      this.document.head.innerHTML = `\n\t<title>${this.title}</title>`
      head.meta.forEach(meta => {
        this.document.head.innerHTML = this.document.head.innerHTML + `\n\t<meta ${meta.type} ${meta.value} />`
      })
      head.scripts.forEach(script => {
        this.document.head.innerHTML =
          this.document.head.innerHTML +
          `\n\t<script ` +
          `${script?.src && script.src.length > 0 ? `src="${script.src}"` : ''}` +
          `${script?.defer && script.defer == true ? ' defer="true"' : ''}` +
          `${script?.module ? ' module' : ''}>` +
          `${script?.value ? `\n\t\t ${script.value}\n\t</script>` : '</script>'}`
      })
      head.styles.forEach(style => {
        //TODO: onboard styles
        // Build all styles into a single string.
        // let styleString = ''
        // styles.forEach(style => {
        //   styleString = styleString + style
        // })
        // this.document.body.innerHTML = this.document.body.innerHTML + `\n<style>${styleString}</style>\n`
        this.document.head.innerHTML = this.document.head.innerHTML + `\n\t<link rel="stylesheet" href="${style}" />`
      })
      this.document.head.innerHTML = this.document.head.innerHTML + `\n`

      return {
        success: true,
        message: 'Head content built successfully.',
      }
    } catch (error) {
      if (this.LogLevel > 1) {
        console.log(error)
      }

      return {
        success: false,
        message: error,
      }
    }
  }

  // 2. Update the body
  private async buildBody(body: htmlConfig['body']) {
    try {
      // deconstruct config values
      const { classList } = body
      // Set the classList
      this.document.body.innerHTML = `\n` + this.document.body.innerHTML
      this.document.body.className = classList.join(' ')
      return {
        success: true,
        message: 'Body content built successfully.',
      }
    } catch (error) {
      if (this.LogLevel > 1) {
        console.log(error)
      }

      return {
        success: false,
        message: error,
      }
    }
  }

  private async buildContent() {
    try {
      let content: any[] = []
      // Run through all Processed Elements and generate HTML.
      const htmlElements = this.elements.HtmlElements
      // console.log('htmlElements', htmlElements)

      for (const group of htmlElements) {
        for (const element of group.Elements) {
          content.push({
            data: await this.generateHtml(element),
          })
        }
      } // Finished running through building.

      return {
        success: true,
        message: 'BuildHtml.buildContent() content built successfully.',
        data: content
      }
    } catch (error) {
      if (this.LogLevel > 1) {
        console.log(error)
      }

      return {
        success: false,
        message: error,
      }
    }
  }

  /**
   * Generates HTML from the provided element into target parent.
   *
   * @type {function} generateHtml
   * @function generateHtml
   * @access private
   * @memberof module:DocsToUi
   * @summary Generates HTML from the provided element.
   * @description a recursive function that takes an element and its parent as parameters. It creates an HTML element based on the elementType property of the input element, sets its attributes and classes, and appends it to the parent element.
   * @param {object} element - The element to be rendered.
   * @param {object} parent - The parent element to append the rendered element. Default is body.
   * @return {object} The rendered element.
   * @fires setAttributes
   * @changelog 2021-07-22 | Erik Plachta | Created private function to map through all elements and generate HTML.
   */
  private async generateHtml(element: any, parent: any = this.document.body): Promise<any> {
    // console.log('parent: ', parent)
    // console.log('element: ', element)
    let el: any

    try {
      el = this.document.createElement(element.elementType)

      // Utility function to set attributes on an element.
      function setAttributes(obj: any, el: any) {
        for (const key of Object.keys(obj)) {
          const value = obj[key]
          if (value !== null) {
            el.setAttribute(`data-${key}`, value)
          }
        }
      }

      if (element.id) {
        el.id = element.id
      }
      if (element.dataAttributes) {
        setAttributes(element.dataAttributes, el)
      }

      // Build content if any defined, otherwise use the value
      if (element.content) {
        // If content is an array, run through each item and append to the element.
        if (Array.isArray(element.content)) {
          element.content.forEach((content: any) => {
            // If it's a node already, append it to current element.
            if (content.nodeType) {
              el.appendChild(content)
            }
            // If it's an object, run through and build a list from it..
            // TODO: Add more complex support for diff types of objects to render.
            else if (typeof content === 'object') {
              const list = this.document.createElement('ul')
              for (const key of Object.keys(content)) {
                // if has content, render it.
                if (content[key]?.length != 0 && content[key] != (null && undefined && '')) {
                  // console.log('key: ', key, ' | content[key]: ', content[key])
                  const li = this.document.createElement('li')
                  li.textContent = `${key}: ${content[key]}`
                  list.appendChild(li)
                }
              }
              el.appendChild(list)
            }
            // Otherwise, it's text content so just render text.
            else {
              el.textContent = el.textContent + content
            }
          })
        }
      } else if (element.dataAttributes.value) {
        el.textContent = element.dataAttributes.value
      }

      // Set classes if any defined.
      if (element.classList) {
        el.className = element.classList.join(' ')
      }

      // Set attributes if any defined.
      if (element.description) {
        el.setAttribute('data-description', element.description)
      }

      // Set attributes if any defined.
      if (element.value) {
        el.setAttribute('data-value', element.value)
      }

      // Set attributes if any defined.
      parent.appendChild(el)

      // If the element has children, run through them and generate HTML.
      if (element.children) {
        for (const child of element.children) {
          await this.generateHtml(child, el)
        }
      }

      // -- return results
      return Promise.resolve({
        success: true,
        message: 'Element rendered successfully.',
        data: {
          el,
          parent,
          element,
        },
      })
    } catch (error) {
      //-- Error Handling
      if (this.LogLevel > 1) {
        console.log(error)
      }
      console.log(error)
      return Promise.reject({
        success: false,
        message: error,
        data: {
          el,
          parent,
          element,
        },
      })
    }
  }
}

export default BuildHtml
