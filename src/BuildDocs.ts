import fs from 'fs';
import path from 'path';
import { GetDocs } from './GetDocs';  // Assuming GetDocs class is in the same directory.

interface DocResult {
    filePath: string;
    doc: { [key: string]: string[] };
    modifiedDate: Date;
    createdDate: Date;
    allComments: string[];
}

export class BuildDocs {
    private fileTypes: string[];
    private ignorePaths: string[];
    private results: DocResult[];

    constructor(fileTypes: string[], ignorePaths: string[] = []) {
        this.fileTypes = fileTypes;
        this.ignorePaths = ignorePaths;
        this.results = [];
    }

    private shouldIgnore(filePath: string): boolean {
        return this.ignorePaths.some(ignorePath => filePath.includes(ignorePath));
    }

    private isFileType(filePath: string): boolean {
        const extension = path.extname(filePath).substring(1);  // Remove the leading dot
        return this.fileTypes.includes(extension);
    }

    private extractCommentsFromFile(filePath: string) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const stats = fs.statSync(filePath);
        const commentPattern = /\/\*\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g;
        const allCommentPattern = /\/\*[^*]*(\*[^/][^*]*)*\*\/|\/\/.*/g;
        const comments = fileContent.match(commentPattern);
        const allComments = fileContent.match(allCommentPattern);
        
        if (comments) {
            comments.forEach(comment => {
                const doc = new GetDocs(comment);
                this.results.push({
                    filePath,
                    doc: doc.getTags(),
                    createdDate: stats.birthtime,
                    modifiedDate: stats.mtime,
                    allComments: allComments || []
                });
            });
        }
    }

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

    public generateDocs(dirPath: string) {
        this.searchDir(dirPath);
        return this.results;
    }

    public saveDocs(dirPath: string) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, 'docs.json');
        fs.writeFileSync(filePath, JSON.stringify(this.results, null, 2));
    }
}
