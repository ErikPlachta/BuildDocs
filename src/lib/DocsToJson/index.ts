/**
 * @type {file} DocsToJson\index.ts
 * @namespace {build-docs.DocsToJson}
 * @module DocsToJson
 * @access private
 * @file BuildDocs\index.ts
 * @version 0.1.51
 * @since 0.0.1
 * @license MIT
 * @author Erik Plachta
 * @created 2023-07-12
 * @updated 2023-07-13
 * @import { randomUUID } from 'crypto'
 * @requires fs
 * @import path from 'path'
 * @requires path
 *
 * @requires crypto
 * @requires module:GetDocs
 */

import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import GetDocs from '../GetDocs' // Assuming GetDocs class is in the same directory.
import { Comments, CommentsProcessed } from '../types'

/**
 * @type {class} BuildDocs
 * @memberof module:build-docs.DocsToJson
 * @access private
 * @class BuildDocs
 * @classdesc Extract Documentation for target files types in target directory.
 */
class DocsToJson {
  private targetPath: string
  private targetPaths: string[]
  private ignorePaths: string[]
  private targetFiles: string[]
  private ignoreFiles: string[]
  private targetFileTypes: string[]
  private outputPath: string
  private results: Comments[]
  public patterns: {
    jsdoc: RegExp
  }

  /**
   * @constructor
   * @access public
   * @memberof module:build-docs.DocsToJson
   * @type {function} constructor
   * @summary Constructor for the BuildDocs class.
   * @description Initializes a new instance of the BuildDocs class.
   * @param {string} targetPath - The location to search within.
   * @param {string[]} targetPaths - The paths to generate documentation for.
   * @param {string[]} ignorePaths - The paths to ignore while searching for files.
   * @param {string[]} targetFiles - The files to generate documentation for.
   * @param {string[]} ignoreFiles - The files to ignore while searching for files.
   * @param {string[]} targetFileTypes - The file types to generate documentation for.
   * @param {string} outputPath - The location to output the documentation to.
	 * @prop {array} results - The results of the documentation generation.
	 * @prop {object} patterns - The patterns to look for in comments used to extract documentation.
   * @returns {BuildDocs} - A new instance of the BuildDocs class.
   */
  constructor(
    targetPath: string,
    targetPaths: string[] = [],
    ignorePaths: string[] = [],
    targetFiles: string[] = [],
    ignoreFiles: string[] = [],
    targetFileTypes: string[],
    outputPath: string,
  ) {
    this.targetPath = targetPath
    this.targetPaths = targetPaths //TODO: 20230713 #EP || Implement targetPaths
    this.ignoreFiles = ignoreFiles
    this.targetFiles = targetFiles //TODO: 20230713 #EP || Implement targetFiles
    this.ignorePaths = ignorePaths
    this.targetFileTypes = targetFileTypes
    this.outputPath = outputPath
    this.results = []
    this.patterns = {
      'jsdoc': /\/\*\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,
    }
  }

  /**
   * @type {function} build
   * @memberof namespace:build-docs
   * @memberof module:build-docs
   * @memberof module:build-docs.DocsToJson
   * @requires module:GetDocs
   * @access private
   * @function shouldIgnore
   * @summary Check if a file path should be ignored.
   * @description Checks if a file path should be ignored based on the ignorePaths property.
   * @param {string} filePath - The file path to check.
   * @returns {boolean} - Whether the file path should be ignored.
   */
  private shouldIgnore(filePath: string): boolean {
    return this.ignorePaths.some(ignorePath => filePath.includes(ignorePath))
  }

  /**
   * @function isFileType
   * @access private
   * @memberof module:build-docs.DocsToJson
   * @summary Check if a file is of one of the specified file types.
   * @description Checks if a file is of one of the specified file types based on the targetFileTypes property.
   * @param {string} filePath - The file path to check.
   * @returns {boolean} - Whether the file is of one of the specified file types.
   */
  private isFileType(filePath: string): boolean {
    try {
      const extension = path.extname(filePath).substring(1) // Remove the leading dot
      return this.targetFileTypes?.includes(extension)
    } catch (error) {
      console.error(error)
      return false
    }
  }

  /**
   * @access public
   * @function setTargetPath
   * @type {function} setTargetPath
   * @memberof module:build-docs.DocsToJson
   * @summary Utility for updating the targetPath property of BuildDocs.
   * @param {string} targetPath - The directory to search within.
   * @returns {boolean} - Whether the targetPath was successfully updated
   * @throws {Error} - If the targetPath does not exist.
   * @todo onboard this.
   */
  setTargetPath(outputPath: string): boolean | Error {
    try {
      //-- Check if the targetPath exists, throw error if it does not.
      if (!fs.existsSync(outputPath)) {
        throw new Error('Root path does not exist.')
      }
      this.outputPath = outputPath
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  /**
   * @type {function} build
   * @function handleGetDocs
   * @memberof module:build-docs.DocsToJson
   * @requires module:GetDocs
   * @fires GetDocs.constructor(comment)
   * @fires GetDocs.getCommentsRaw
   * @summary Extract comments from a file and add them to the results.
   * @description Looks for comment blocks. If found instantiates a new `GetDocs` instance and adds the results to the results property.
   * @param {string} filePath - The path of the file to extract comments from.
   * @returns {boolean} - True if the comments were successfully extracted. False if no comments or issue.
   */
  private handleGetDocs(filePath: string, pattern = this.patterns.jsdoc): boolean {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const fileName = path.basename(filePath)
      const stats = fs.statSync(filePath)

      const comments = fileContent.match( pattern )

      // If there is a comment block following format, extract the comment block.
      if (comments) {
        comments.forEach(comment => {
          //-- Instantiate a new GetDocs instance and add the results to the results property.
          const doc = new GetDocs(comment)

          //-- Add the results to the `this.results` for this class.
          this.results.push({
            id: randomUUID(),
            fileName,
            filePath,
            comments: doc.getCommentsRaw(),
            createdDate: stats.birthtime,
            modifiedDate: stats.mtime,
          })
        })
        //-- return true because done running without issue
        return true
      } else {
        //-- return false because no comments found
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  /**
   * @type {function} build
   * @memberof module:build-docs.DocsToJson
   * @access private
   * @fires BuildDocs.handleGetDocs
   * @fires BuildDocs.isFileType
   * @fires BuildDocs.shouldIgnore
   * @function searchDir
   * @summary Search a directory for files of the specified types and extract their comments.
   * @description Searches a directory for files of the specified types and extracts their comments.
   * @param {string} targetPath - The path of the directory to search.
   */
  private searchDir(targetPath: string, pattern = this.patterns.jsdoc) {
    //-- Don't search within if to be ignored
    if (this.shouldIgnore(targetPath)) return false
    // console.log('searchDir(targetPath: string): ', targetPath)

    const files = fs.readdirSync(targetPath)
    files.forEach(file => {
      const filePath = path.join(targetPath, file)
      if (!this.shouldIgnore(filePath)) {
        if (fs.statSync(filePath).isDirectory()) {
          this.searchDir(filePath)
        } else if (this.isFileType(filePath)) {
          this.handleGetDocs(filePath, pattern)
        }
      }
    })
  }

  /**
   * @function generateDocs
   * @access public
   * @type {function} generateDocs
   * @memberof module:build-docs.DocsToJson
   * @summary Generate documentation for files in a directory.
   * @description Generates documentation for files in a directory and stores the results in the results property.
   * @param {string} targetPath - The path of the directory to generate documentation for.
   * @returns {DocResult[]} - The generated documentation.
   */
  public generateDocs(targetPath: string) {
    if (!targetPath) throw new Error('No targetPath provided.')
    this.searchDir(targetPath)
    return this.results
  }

  /**
   * @function saveDocs
   * @access public
   * @memberof module:build-docs.DocsToJson
   * @summary Save the generated documentation to a file.
   * @description Saves the generated documentation to a file in a specified directory.
   * @param {string} targetPath - The path of the directory to save the documentation to.
   * @returns {SaveResult} - The result of the save operation.
   * @todo add param for docs name
   * @todo add param for file type(s)
   */
  public saveDocs(outputPath: string): {
    success: boolean
    function: string
    message: string | unknown
    outputPath: string
    filePath?: string
  } {
    try {
      //-- make targetPath if not defined
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true })
      }
      const filePath = path.join(outputPath, 'docs.json')
      fs.writeFileSync(filePath, JSON.stringify(this.results, null, 2))
      return {
        success: true,
        function: 'saveDocs',
        message: 'Docs saved successfully.',
        outputPath,
        filePath,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        function: 'saveDocs',
        message: error,
        outputPath,
      }
    }
  }
}

module.exports = DocsToJson
