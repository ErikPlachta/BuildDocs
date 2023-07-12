import fs from 'fs';
import path from 'path';
import { GetDocs } from './GetDocs';  // Assuming GetDocs class is in the same directory.

interface DocResult {
    filePath: string;
    doc: { [key: string]: string[] };
    modifiedDate: Date;
    createdDate: Date;
    allComments: { comment: string }[];
}

/**
 * @class
 * @classdesc A class for generating documentation for files in a directory.
 * @public
 */
export class BuildDocs {
    private fileTypes: string[];
    private ignorePaths: string[];
    private results: DocResult[];

    /**
     * @constructor
     * @public
     * @memberof BuildDocs
     * @summary Constructor for the BuildDocs class.
     * @description Initializes a new instance of the BuildDocs class.
     * @param {string[]} fileTypes - The file types to generate documentation for.
     * @param {string[]} ignorePaths - The paths to ignore while searching for files.
     */
    constructor(fileTypes: string[], ignorePaths: string[] = []) {
        this.fileTypes = fileTypes;
        this.ignorePaths = ignorePaths;
        this.results = [];
    }

    /**
     * @function
     * @private
     * @memberof BuildDocs
     * @summary Check if a file path should be ignored.
     * @description Checks if a file path should be ignored based on the ignorePaths property.
     * @param {string} filePath - The file path to check.
     * @returns {boolean} - Whether the file path should be ignored.
     */
    private shouldIgnore(filePath: string): boolean {
        return this.ignorePaths.some(ignorePath => filePath.includes(ignorePath));
    }

    /**
     * @function
     * @private
     * @memberof BuildDocs
     * @summary Check if a file is of one of the specified file types.
     * @description Checks if a file is of one of the specified file types based on the fileTypes property.
     * @param {string} filePath - The file path to check.
     * @returns {boolean} - Whether the file is of one of the specified file types.
     */
    private isFileType(filePath: string): boolean {
        const extension = path.extname(filePath).substring(1);  // Remove the leading dot
        return this.fileTypes.includes(extension);
    }

    /**
     * @function
     * @private
     * @memberof BuildDocs
     * @summary Extract comments from a file and add them to the results.
     * @description Extracts comments from a file and adds them to the results property.
     * @param {string} filePath - The path of the file to extract comments from.
     */
    private extractCommentsFromFile(filePath: string) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const stats = fs.statSync(filePath);
        const commentPattern = /\/\*\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g;
        const allCommentPattern = /\/\*[^*]*(\*[^/][^*]*)*\*\/|\/\/.*/g;
        const comments = fileContent.match(commentPattern);
        const allComments = fileContent.match(allCommentPattern) || [];
        
        if (comments) {
            comments.forEach(comment => {
                const doc = new GetDocs(comment);
                this.results.push({
                    filePath,
                    doc: doc.getTags(),
                    createdDate: stats.birthtime,
                    modifiedDate: stats.mtime,
                    allComments: allComments.map(comment => ({ comment }))
                });
            });
        }
    }

    /**
     * @function
     * @private
     * @memberof BuildDocs
     * @summary Search a directory for files of the specified types and extract their comments.
     * @description Searches a directory for files of the specified types and extracts their comments.
     * @param {string} dirPath - The path of the directory to search.
     */
    private searchDir(dirPath: string) {
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const filePath = path.join(dirPath, file);

            if (!this.shouldIgnore(filePath)) {
                if (fs.statSync(filePath).isDirectory()) {
                    this.searchDir(filePath);
                } else if (this.isFileType(filePath)) {
                    this.extractCommentsFromFile(filePath);
                }
            }
        });
    }

    /**
     * @function
     * @public
     * @memberof BuildDocs
     * @summary Generate documentation for files in a directory.
     * @description Generates documentation for files in a directory and stores the results in the results property.
     * @param {string} dirPath - The path of the directory to generate documentation for.
     * @returns {DocResult[]} - The generated documentation.
     */
    public generateDocs(dirPath: string) {
        this.searchDir(dirPath);
        return this.results;
    }

    /**
     * @function
     * @public
     * @memberof BuildDocs
     * @summary Save the generated documentation to a file.
     * @description Saves the generated documentation to a file in a specified directory.
     * @param {string} dirPath - The path of the directory to save the documentation to.
     */
    public saveDocs(dirPath: string) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, 'docs.json');
        fs.writeFileSync(filePath, JSON.stringify(this.results, null, 2));
    }
}
