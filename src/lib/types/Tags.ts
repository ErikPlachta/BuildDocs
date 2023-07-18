/**
 * @type {interface} CommentsRa
 * @memberof module:GetDocs
 * @access private
 * @summary Type definitions for the Tags object.
 * @description An array of tag objects for each comment block, which is used to populate the 'doc' object within results.
 * @prop {string} key - The key of the tag.
 * @prop {Array<Tag>} value - The value of the tag.
 */
type CommentsRaw = {
  [key: string]: Array<CommentRaw>
}

/**
* @type {interface} CommentRaw
* @access private
* @memberof module:GetDocs
* @summary Type definitions for the Tag object.
* @description An object for each tag within a comment block.
* @prop {string} line - The entire line of the tag.
* @prop {string} type - The type of the tag.
* @prop {string} description - The description of the tag.
* @prop {string} index - The index of the tag.
* @prop {string} raw - The raw input of the tag.
*/
type CommentRaw = {
  line: string
  type: string
  description: string
  index: string
  raw: string
}
