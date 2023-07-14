class ConvertJsonToDocs {
    constructor(data) {
        this.data = data;
    }

    toMarkdown() {
        let markdown = '';
        let lastFileName = '';
        let lastModuleName = '';

        this.data.forEach((item) => {
            if (item.fileName !== lastFileName) {
                markdown += `# File: [${item.fileName}](#${item.fileName.replace('.', '')})\n`;
                lastFileName = item.fileName;
            }

            if (item.doc.module && item.doc.module[0].description !== lastModuleName) {
                markdown += `## Module: [${item.doc.module[0].description}](#${item.doc.module[0].description.replace('.', '')})\n`;
                lastModuleName = item.doc.module[0].description;
            }

            if (item.doc.function) {
                markdown += `### Function: [${item.doc.function[0].description}](#${item.doc.function[0].description.replace('.', '')})\n`;
            }

            Object.entries(item.doc).forEach(([key, valArray]) => {
                if (key !== 'module' && key !== 'function') {
                    valArray.forEach(val => {
                        markdown += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${val.description}\n`;
                    });
                }
            });

            markdown += `**Created Date:** ${item.createdDate}\n`;
            markdown += `**Modified Date:** ${item.modifiedDate}\n\n`;
        });

        return markdown;
    }

    toHtml() {
        let html = `
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="p-8">
        `;

        let lastFileName = '';
        let lastModuleName = '';

        this.data.forEach((item) => {
            if (item.fileName !== lastFileName) {
                html += `<div id="${item.fileName.replace('.', '')}" class="file-card my-4 rounded border shadow-sm p-4">\n<h1 class="text-2xl font-bold mb-2">File: ${item.fileName}</h1>\n`;
                lastFileName = item.fileName;
            }

            if (item.doc.module && item.doc.module[0].description !== lastModuleName) {
                html += `<div id="${item.doc.module[0].description.replace('.', '')}" class="card my-4 rounded border shadow-sm p-4">\n<h2 class="text-xl font-bold mb-2">Module: ${item.doc.module[0].description}</h2>\n`;
                lastModuleName = item.doc.module[0].description;
            }

            if (item.doc.function) {
                html += `<div id="${item.doc.function[0].description.replace('.', '')}" class="card my-4 rounded border shadow-sm p-4">\n<h3 class="text-lg font-bold mb-2">Function: ${item.doc.function[0].description}</h3>\n`;
            }

            Object.entries(item.doc).forEach(([key, valArray]) => {
                if (key !== 'module' && key !== 'function') {
                    valArray.forEach(val => {
                        if (key === 'memberof' || key === 'requires') {
                            let link = val.description.replace('.', '');
                            html += `<li class="type-${key} mb-2">${key.charAt(0).toUpperCase() + key.slice(1)}: <a href="#${link}" class="text-blue-600 hover:underline">${val.description}</a></li>\n`;
                        } else {
                            html += `<li class="type-${key} mb-2">${key.charAt(0).toUpperCase() + key.slice(1)}: ${val.description}</li>\n`;
                        }
                    });
                }
            });

            html += `<li class="mb-2">Created Date: ${item.createdDate}</li>\n`;
            html += `<li class="mb-2">Modified Date: ${item.modifiedDate}</li>\n</div>\n`;

        });

        html += '</body></html>';
        return html;
    }
}

module.exports = ConvertJsonToDocs;