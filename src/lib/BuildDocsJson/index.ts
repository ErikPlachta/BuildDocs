/**
 * @type {file} BuildDocs.ts
 * @module BuildDocsJson
 * @memberof namespace:build-docs
 * @access private
 * @file BuildDocs.ts
 * @version 0.1.51
 * @since 0.0.1
 * @license MIT
 * @author Erik Plachta
 * @created 2023-07-12
 * @updated 2023-07-13
 * @requires fs
 * @requires path
 * @requires crypto
 * @requires module:GetDocs
 */

import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import GetDocs from '../GetDocs' // Assuming GetDocs class is in the same directory.

/**
 * @type {interface} DocResult
 * @memberof module:BuildDocsJson
 * @access private
 * @interface DocResult
 * @summary The result of extracting documentation from a file.
 * @description The result of extracting documentation from a file.
 * @memberof module:BuildDocsJson
 * @property {string} id - The unique identifier for the file.
 * @property {string} fileName - The name of the file itself.
 * @property {string} filePath - The path to the file.
 * @property {object} doc - The documentation extracted from the file.
 * @property {Date} modifiedDate - The date the file was last modified.
 * @property {Date} createdDate - The date the file was created.
 * @property {object[]} relatedComments - All comments extracted from the file.
 */
interface DocResult {
    id: string
    fileName: string
    filePath: string
    doc: any
    modifiedDate: Date
    createdDate: Date
    //-- All related comments and their full comment blocks within the file.
    //TODO: 20230713 #EP || Convert from getting all comments to showing relation by IDs, children, parent, etc.
    relatedComments: {
        commentBlock: string
    }[]
    // relatedComments: { comment: string }[]
}

/**
 * @type {class} BuildDocs
 * @memberof module:BuildDocsJson
 * @access private
 * @class BuildDocs
 * @classdesc Extract Documentation for target files types in target directory.
 */
export class BuildDocsJson {
    private targetPath: string
    private targetPaths: string[]
    private ignorePaths: string[]
    private targetFiles: string[]
    private ignoreFiles: string[]
    private targetFileTypes: string[]
    private outputPath: string
    private results: DocResult[]

    /**
     * @constructor
     * @access public
     * @memberof module:BuildDocsJson
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
     * @returns {BuildDocs} - A new instance of the BuildDocs class.
     */
    constructor(
        targetPath: string,
        targetPaths: string[] = [],
        ignorePaths: string[] = [],
        targetFiles: string[] = [],
        ignoreFiles: string[] = [],
        targetFileTypes: string[],
        outputPath: string
    ) {
        this.targetPath = targetPath
        this.targetPaths = targetPaths //TODO: 20230713 #EP || Implement targetPaths
        this.ignoreFiles = ignoreFiles
        this.targetFiles = targetFiles //TODO: 20230713 #EP || Implement targetFiles
        this.ignorePaths = ignorePaths
        this.targetFileTypes = targetFileTypes
        this.outputPath = outputPath
        this.results = []
    }

    /**
     * @type {function} build
     * @memberof namespace:build-docs
     * @memberof module:build-docs
     * @memberof module:BuildDocsJson
     * @requires module:GetDocs
     * @access private
     * @function shouldIgnore
     * @summary Check if a file path should be ignored.
     * @description Checks if a file path should be ignored based on the ignorePaths property.
     * @param {string} filePath - The file path to check.
     * @returns {boolean} - Whether the file path should be ignored.
     */
    private shouldIgnore(filePath: string): boolean {
        return this.ignorePaths.some((ignorePath) =>
            filePath.includes(ignorePath)
        )
    }

    /**
     * @function isFileType
     * @access private
     * @memberof module:BuildDocsJson
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
     * @memberof module:BuildDocsJson
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
     * @access public
     * @function setOutputPath
     * @type {function} setOutputPath
     * @memberof module:BuildDocsJson
     * @summary Evaluating results and building relationships between accordingly.
     *
     * @todo 20230713 #EP | Build this out once everything else is verified.
     */
    private getRelatedComments() {
        this.results.forEach((result) => {
            console.log(result)
        })
    }

    /**
     * @type {function} build
     * @memberof module:BuildDocsJson
     * @access private
     * @function extractCommentsFromFile
     * @augments GetDocs constructor
     * @fires GetDocs.constructor(comment)
     * @fires GetDocs.getTags
     * @summary Extract comments from a file and add them to the results.
     * @description Extracts comments from a file and adds them to the results property.
     * @param {string} filePath - The path of the file to extract comments from.
     * @returns {boolean} - Whether the comments were successfully extracted.
     */
    private extractCommentsFromFile(filePath: string): boolean {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const fileName = path.basename(filePath)
            const stats = fs.statSync(filePath)
            const commentPattern =
                /\/\*\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g
            const comments = fileContent.match(commentPattern)
            // const relatedComments = fileContent.match(allCommentPattern) || []

            if (comments) {
                comments.forEach((comment) => {
                    const doc = new GetDocs(comment)
                    this.results.push({
                        id: randomUUID(),
                        fileName,
                        filePath,
                        doc: doc.getTags(),
                        createdDate: stats.birthtime,
                        modifiedDate: stats.mtime,
                        relatedComments: [], //TODO: 20230713 #EP || Convert to children comments/related.
                        // relatedComments: relatedComments.map((commentBlock: any) => ({
                        //     commentBlock,
                        // })),
                    })
                })
            }
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    /**
     * @type {function} build
     * @memberof module:BuildDocsJson
     * @access private
     * @fires BuildDocs.extractCommentsFromFile
     * @fires BuildDocs.isFileType
     * @fires BuildDocs.shouldIgnore
     * @function searchDir
     * @summary Search a directory for files of the specified types and extract their comments.
     * @description Searches a directory for files of the specified types and extracts their comments.
     * @param {string} targetPath - The path of the directory to search.
     */
    private searchDir(targetPath: string) {
        //-- Don't search within if to be ignored
        if (this.shouldIgnore(targetPath)) return false
        // console.log('searchDir(targetPath: string): ', targetPath)

        const files = fs.readdirSync(targetPath)
        files.forEach((file) => {
            const filePath = path.join(targetPath, file)
            if (!this.shouldIgnore(filePath)) {
                if (fs.statSync(filePath).isDirectory()) {
                    this.searchDir(filePath)
                } else if (this.isFileType(filePath)) {
                    this.extractCommentsFromFile(filePath)
                }
            }
        })
    }

    /**
     * @function generateDocs
     * @access public
     * @type {function} generateDocs
     * @memberof module:BuildDocsJson
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
     * @memberof module:BuildDocsJson
     * @summary Save the generated documentation to a file.
     * @description Saves the generated documentation to a file in a specified directory.
     * @param {string} targetPath - The path of the directory to save the documentation to.
     * @returns {SaveResult} - The result of the save operation.
     * @todo add param for docs name
     * @todo add param for file type(s)
     */
    public saveDocs(outputPath: string) {
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

module.exports = BuildDocsJson
