import { htmlConfig, ElementsProcessed, Logging } from '../../types'
import { JSDOM } from 'jsdom'

/**
 * Called by `JsonToUi` to generate HTML from the JSON data.
 *
 * @access private
 * @class BuildHtml
 * @memberof module:JsonToUi
 * @memberof namespace:build-docs.JsonToUi
 * @module BuildHtml
 * @requires JSDOM
 * @requires module:JsonToUi~htmlConfig
 * @requires module:JsonToUi~ElementsProcessed
 * @summary Called by `JsonToUi.` to generate HTML from the JSON data.
 * @description a recursive function that takes an element and its parent as parameters. It creates an HTML element based on the elementType property of the input element, sets its attributes and classes, and appends it to the parent element.
 * @version 0.0.3
 * @author Erik Plachta
 * @since 0.0.1
 * @changelog 0.0.1 | 2023-07-22 | Generated concept within JsonToUi
 * @changelog 0.0.2 | 2023-07-22 | Converted to module due to size and complexity.
 * @changelog 0.0.3 | 2023-07-22 | Updated to a Class object and refined.
 * @param {ElementsProcessed} elements - The elements to be rendered.
 * @param {string} title - The title of the document.
 * @param {HtmlConfig} htmlConfig - The configuration object for the each section within the HTML document.
 * @param {boolean} DEBUG - Optional param to enable debugging. If true, will output debug information to the console.
 * @return {string} - The complete HTML document.
 */
class BuildHtml {
  private LogLevel: Logging['option']['level']['value']
  private dom: JSDOM = new JSDOM(`<!DOCTYPE html>`) // Create a new JSDOM instance and get the document from it.
  private document: Document = this.dom.window.document
  private elements: ElementsProcessed
  private title: string = 'No-Title-Set' // Default title.
  private htmlConfig: htmlConfig
  private resultsIfError: (error: string) => string
  public results: string | undefined

  constructor(
    LogLevel: Logging['option']['level']['value'],
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

    // Run the build function and return it's results.
    this.build()
      .then(results => {
        this.results = results
        return Promise.resolve(results)
      })
      .catch(error => {
        this.resultsIfError(error)
        this.results = this.resultsIfError(error)
        return Promise.reject(this.results)
      })
  }

  async build(): Promise<string> {
    try {
      // Deconstruct the htmlConfig object.
      const { head, body } = this.htmlConfig

      // 1. Set head config.
      this.buildHead(head)
      // 2. Set body config.
      this.buildBody(body)
      // 3. Build content within body.
      this.buildContent()

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
        this.document.head.innerHTML = this.document.head.innerHTML + `\n\t<meta ${meta} />`
      })
      head.scripts.forEach(script => {
        this.document.head.innerHTML = this.document.head.innerHTML + `\n\t<script src="${script}"></script>`
      })
      head.styles.forEach(style => {
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
      const { classList, styles } = body
      // Set the classList
      this.document.body.className = classList.join(' ')

      // Build all styles into a single string.
      let styleString = ''
      styles.forEach(style => {
        styleString = styleString + style
      })
      this.document.body.innerHTML = this.document.body.innerHTML + `\n<style>${styleString}</style>\n`
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
      // Run through all Processed Elements and generate HTML.
      const htmlElements = this.elements.HtmlElements
      for (const group of htmlElements) {
        for (const element of group.Elements) {
          await this.generateHtml(element)
        }
      } // Finished running through building.
      return {
        success: true,
        message: 'Content built successfully.',
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
   * @memberof module:JsonToUi
   * @summary Generates HTML from the provided element.
   * @description a recursive function that takes an element and its parent as parameters. It creates an HTML element based on the elementType property of the input element, sets its attributes and classes, and appends it to the parent element.
   * @param {object} element - The element to be rendered.
   * @param {object} parent - The parent element to append the rendered element. Default is body.
   * @return {object} The rendered element.
   * @fires setAttributes
   * @changelog 2021-07-22 | Erik Plachta | Created private function to map through all elements and generate HTML.
   */
  private async generateHtml(element: any, parent: any = this.document.body) {
    try {
      const el = this.document.createElement(element.elementType)

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
      if (element.classList) {
        el.className = element.classList.join(' ')
      }
      if (element.description) {
        el.setAttribute('data-description', element.description)
      }
      if (element.value) {
        el.setAttribute('data-value', element.value)
        el.innerHTML = element.value
      }

      parent.appendChild(el)

      // If more to render, do so.
      if (element.children) {
        for (const child of element.children) {
          await this.generateHtml(child, el)
        }
      }
      return el
    } catch (error) {
      // end of generateHtml function.
      if (this.LogLevel > 1) {
        console.log(error)
      }

      console.log(error)

      return null
    }
  }
}

export default BuildHtml
