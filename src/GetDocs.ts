/**
 * @class
 * @classdesc A class for extracting JSDoc comments from a string.
 * @public
 */
export class GetDocs {
    private comment: string;
    private tags: { [key: string]: string[] };
    private description: string;

    /**
     * @constructor
     * @public
     * @memberof GetDocs
     * @summary Constructor for the GetDocs class.
     * @description Initializes a new instance of the GetDocs class.
     * @param {string} comment - The comment string to extract JSDoc comments from.
     */
    constructor(comment: string) {
        this.comment = comment;
        this.tags = {};
        this.description = "";
        this.parseComment();
    }

    /**
     * @function
     * @private
     * @memberof GetDocs
     * @summary Parse the comment string and extract JSDoc comments.
     * @description Parses the comment string and extracts JSDoc comments.
     */
    private parseComment(): void {
        const lines = this.comment.split('\n');
        const tags: { [key: string]: string[] } = {};

        lines.forEach(line => {
            const tagMatch = line.match(/@(\w+)\s+(.+)/);
            if (tagMatch) {
                const tag = tagMatch[1];
                const description = tagMatch[2];
                if (!tags[tag]) {
                    tags[tag] = [];
                }
                tags[tag].push(description.trim());
            } else {
                const descriptionMatch = line.match(/\*\s+(.+)/);
                if (descriptionMatch) {
                    this.description += descriptionMatch[1] + '\n';
                }
            }
        });

        this.tags = tags;
    }

    /**
     * @function
     * @public
     * @memberof GetDocs
     * @summary Get the descriptions for a specific JSDoc tag.
     * @description Gets the descriptions for a specific JSDoc tag.
     * @param {string} tag - The JSDoc tag to get the descriptions for.
     * @returns {string[] | undefined} - The descriptions for the specified JSDoc tag, or undefined if the tag does not exist.
     */
    public getTag(tag: string): string[] | undefined {
        return this.tags[tag];
    }

    /**
     * @function
     * @public
     * @memberof GetDocs
     * @summary Get the top line description and any other lines that are not part of a JSDoc tag.
     * @description Gets the top line description and any other lines that are not part of a JSDoc tag.
     * @returns {string} - The description.
     */
    public getDescription(): string {
        return this.description.trim();
    }

    /**
     * @function
     * @public
     * @memberof GetDocs
     * @summary Get the comment string.
     * @description Gets the comment string.
     * @returns {string} - The comment string.
     */
    public getComment(): string {
        return this.comment;
    }

    /**
     * @function
     * @public
     * @memberof GetDocs
     * @summary Get all JSDoc tags and their descriptions.
     * @description Gets all JSDoc tags and their descriptions.
     * @returns {{ [key: string]: string[] }} - An object where the keys are JSDoc tags and the values are arrays of descriptions for each tag.
     */
    public getTags(): { [key: string]: string[] } {
        return this.tags;
    }
}
