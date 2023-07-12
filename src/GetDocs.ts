export class GetDocs {
    private comment: string;
    private tags: { [key: string]: string[] };
    private description: string;

    constructor(comment: string) {
        this.comment = comment;
        this.tags = {};
        this.description = "";
        this.parseComment();
    }

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

    public getTag(tag: string): string[] | undefined {
        return this.tags[tag];
    }

    public getDescription(): string {
        return this.description.trim();
    }

    public getComment(): string {
        return this.comment;
    }

    public getTags(): { [key: string]: string[] } {
        return this.tags;
    }
} 
 