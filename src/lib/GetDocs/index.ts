/**
 * This Utility is used by BuildDocs to extract JSDoc data from file.
 * @type {file} GetDocs\index.ts
 * @namespace {build-docs.GetDocs}
 * @module GetDocs
 * @file GetDocs\index.ts
 * @access private
 * @summary This Utility is used by BuildDocs to extract JSDoc data from file.
 * @description
 * @version 0.2.2
 * @since 0.0.1
 * @author Erik Plachta
 * @license MIT
 * @created 2023-07-12
 * @updated 2023-07-13
 * @changelog 0.1.x - MVP Concept of building comments properly. 100% verified getting tags and descriptions.
 * @changelog 0.2.1 - Add more complex comment and tag extraction.
 * @changelog 0.2.2 - Add showing tag connectivity via `@memberof`, `@augments`, `@namespace`, `@fires`, and `@requires`.
 */

import {
    CommentRaw,
    CommentsRaw,    
 } from '../types'

/**
 * @class GetDocs
 * @classdesc A class for extracting JSDoc comments from a string.
 * @access public
 */
class GetDocs {
    private comment: string
    private CommentsRaw: CommentsRaw
    private description: string

    /**
     * @constructor
     * @access public
     * @memberof module:GetDocs
     * @summary Constructor for the GetDocs class.
     * @description Initializes a new instance of the GetDocs class.
     * @fires GetDocs#parseComment
     * @param {string} comment - The comment string to extract JSDoc comments from.
     */
    constructor(comment: string) {
        this.comment = comment
        this.CommentsRaw = {}
        this.description = ''
        this.parseComment()
    }

    /**
     * @function parseComment
     * @access private
     * @memberof module:GetDocs
     * @type {function} parseComment
     * @summary Parse the comment string and extract JSDoc comments.
     * @description Parses the comment string and extracts JSDoc comments.
     * @version 0.2.0 - Added support for multiple lines of description.
     * @since 0.0.1
     * @returns {boolean} - Returns true if successful, otherwise false.
     *
     */
    private parseComment(): boolean {
        // Holds all tag results
        const CommentsRaw: CommentsRaw = {}
        try {
            // Get all lines from the comment-block.
            const lines: string[] = this.comment.split('\n')

            lines.forEach(line => {
                // Does line have an `@` tag.
                const tagMatch = line.match(/@(\w+)\s+(.+)/)
                // example tagMatch:
                // [
                //      '@function run',                        // [0] The entire line
                //      function',                             // [1] The tag
                //      ' run',                                 // [2] The description
                //      index: 3,                               // [4] The index
                //      input: ' * @function run\r',            // [5] The line's raw input
                //      groups: undefined
                // ]

                // Line does have an @tag, so deconstruct and manage accordingly.
                if (tagMatch) {
                    const line = tagMatch[0]
                    const type = tagMatch[1].trim()
                    const description = tagMatch[2].trim()
                    const index = tagMatch[3]
                    const raw = tagMatch[4]

                    // Tag has not yet been, create an array for it to hold results.
                    if (!CommentsRaw[type]) CommentsRaw[type] = []

                    //-- Append the tag to the tags array.
                    CommentsRaw[type].push({
                        line,
                        type,
                        description,
                        index,
                        raw,
                    })
                }
                // It's a line that does not start with an @ tag, so assuming it's part of the description.
                else {
                    const descriptionMatch = line.match(/\*\s+(.+)/)
                    if (descriptionMatch) {
                        this.description += descriptionMatch[1] + '\n'
                    }
                }
            })
            this.CommentsRaw = CommentsRaw

            return true
        } catch (error) {
            console.error(`Error in GetDocs.parseComment: ${error}`)
            return false
        }
    }

    /**
     * @type {function} getCommentsRaw
     * @memberof module:GetDocs
     * @access public
     * @function getCommentsRaw
     * @summary Get all JSDoc tags and their descriptions.
     * @description Gets all JSDoc tags and their descriptions.
     * @returns {CommentsRaw} - An object where the keys are JSDoc tags and the values are arrays of descriptions for each tag.
     */
    public getCommentsRaw(): CommentsRaw {
        return this.CommentsRaw
    }

    /**
     * @type {function} getDescription
     * @memberof module:GetDocs
     * @access public
     * @function getDescription
     * @summary Get the top line description and any other lines that are not part of a JSDoc tag.
     * @description Gets the top line description and any other lines that are not part of a JSDoc tag.
     * @returns {string} - The description.
     */
    public getDescription(): string {
        return this.description.trim()
    }

    /**
     * @type {function} getComment
     * @memberof module:GetDocs
     * @function getComment
     * @access public
     * @summary Get the comment string.
     * @description Gets the comment string.
     * @returns {string} - The comment string.
     */
    public getComment(): string {
        return this.comment
    }
}

module.exports = GetDocs
export default GetDocs
