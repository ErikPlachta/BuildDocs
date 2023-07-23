import { htmlConfig, ElementsProcessed } from '../../../types'

import { JSDOM } from 'jsdom'

// Create a new JSDOM instance and get the document from it.
const dom = new JSDOM(`<!DOCTYPE html>`)
const document = dom.window.document

/**
 * Called by `DocsToUi` to generate HTML from the JSON data.
 * 
 * @memberof DocsToUi
 * @module BuildHtml
 * @summary Called by `DocsToUi` to generate HTML from the JSON data.
 * @description a recursive function that takes an element and its parent as parameters. It creates an HTML element based on the elementType property of the input element, sets its attributes and classes, and appends it to the parent element.   
 * @version 0.0.2
 * @since 0.0.1
 * @author Erik Plachta
 * @changelog 0.0.1 | Generated concept within DocsToUi
 * @changelog 0.0.2 | Converted to module due to size and complexity.
 * 
 * Called by `this.buildHtml()` to convert ElementProcessed data to HTML.
 * @access private
 * @type {function} getHtml
 * @function getHtml
 * @memberof module:DocsToUi
 * @summary Called by `this.buildHtml()` to convert ElementProcessed data to HTML.
 * @description a recursive function that takes an element and its parent as parameters. It creates an HTML element based on the elementType property of the input element, sets its attributes and classes, and appends it to the parent element.
 * @param {string} documentTitle - The title of the document.
 * @param {string[]} scripts - An array of script paths to include in the document.
 * @param {string[]} styles - An array of style paths to include in the document.
 * @param {string[]} meta - An array of meta tags to include in the document.
 * @return {string} The complete HTML document.
 */
function BuildHtml(elements:ElementsProcessed, title: string = 'No-Title-Set', htmlConfig: htmlConfig): string {
  // Deconstruct the htmlConfig object.
  const { head, body } = htmlConfig

  // Build the head content
  document.head.innerHTML = `\n\t<title>${title}</title>`
  head.meta.forEach(meta => {
    document.head.innerHTML = document.head.innerHTML + `\n\t<meta ${meta} />`
  })
  head.scripts.forEach(script => {
    document.head.innerHTML = document.head.innerHTML + `\n\t<script src="${script}"></script>`
  })
  head.styles.forEach(style => {
    document.head.innerHTML = document.head.innerHTML + `\n\t<link rel="stylesheet" href="${style}" />`
  })
  document.head.innerHTML = document.head.innerHTML + `\n`

  // 2. Update the body
  // deconstruct config values
  const { classList, styles } = body
  // Set the classList
  document.body.className = classList.join(' ')

  // Build all styles into a single string.
  let styleString = ''
  styles.forEach(style => {
    styleString = styleString + style
  })
  document.body.innerHTML = document.body.innerHTML + `\n<style>${styleString}</style>\n`
  

  // Run through all Processed Elements and generate HTML.
  const htmlElements = elements.HtmlElements
  htmlElements.forEach((group: any) => {
    group.Elements.forEach((element: any) => {
      generateHtml(element)
    })
  }) // Finished running through building.

  // Returns results back to this.getHtml()
  return `<!DOCTYPE html>\n ${document.documentElement.outerHTML}`
  // return document.body.innerHTML
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
function generateHtml(element: any, parent: any = document.body) {
  // Build HTML element.
  const el = document.createElement(element.elementType)

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
    el.innerHTML(element.value)
  }

  parent.appendChild(el)

  // If more to render, do so.
  if (element.children) {
    for (const child of element.children) {
      generateHtml(child, el)
    }
  }
  return el
} // end of generateHtml function.

export default BuildHtml