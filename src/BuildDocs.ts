
import fs from 'fs';
import path from 'path';
import { JSDoc } from './JSDoc';  // Assuming JSDoc class is in the same directory.

interface DocResult {
    filePath: string;
    doc: { [key: string]: string[] };
    modifiedDate: Date; 
    createdDate: Date;
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

    private extractDocsFromFile(filePath: string) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const stats = fs.statSync(filePath);
        const commentPattern = /\/\*\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g;
        const comments = fileContent.match(commentPattern);
        
        if (comments) {
            comments.forEach(comment => {
                const doc = new JSDoc(comment);
                this.results.push({
                    filePath,
                    doc: doc.getTags(),
                    createdDate: stats.birthtime,
                    modifiedDate: stats.mtime
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
                    this.extractDocsFromFile(filePath);
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

module.exports = BuildDocs