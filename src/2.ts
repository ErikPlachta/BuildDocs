import * as ts from 'typescript';
import fs from 'fs';
import path from 'path';

interface CommentInfo {
    comment: string;
    relatedTo: string;
}

interface DocResult {
    filePath: string;
    doc: { [key: string]: string[] };
    modifiedDate: Date;
    createdDate: Date;
    allComments: CommentInfo[];
}

class DocGenerator {
    // ... other parts of the class ...

    private extractCommentsFromFile(filePath: string) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const stats = fs.statSync(filePath);

        const sourceFile = ts.createSourceFile(
            filePath,
            fileContent,
            ts.ScriptTarget.Latest,
            true,
            ts.ScriptKind.TS
        );

        const allComments: CommentInfo[] = [];

        const visit = (node: ts.Node) => {
            if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isVariableDeclaration(node)) {
                const commentRanges = ts.getLeadingCommentRanges(fileContent, node.getFullStart());
                if (commentRanges) {
                    for (const commentRange of commentRanges) {
                        const comment = fileContent.substring(commentRange.pos, commentRange.end);
                        allComments.push({ comment, relatedTo: node.getText() });
                    }
                }
            }

            ts.forEachChild(node, visit);
        };

        visit(sourceFile);

        // ... other parts of the method ...

        this.results.push({
            filePath,
            doc: doc.getTags(),
            createdDate: stats.birthtime,
            modifiedDate: stats.mtime,
            allComments
        });
    }

    // ... other parts of the class ...
}
