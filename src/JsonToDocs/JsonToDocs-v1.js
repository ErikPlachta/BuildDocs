function convertJsonToDocs(data) {
  let markdown = '';
  let html = `
      <style>
          .card {
              border: 1px solid #ccc;
              padding: 20px;
              margin: 20px;
              border-radius: 10px;
              box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
          }
          .file-card {
              border: 1px solid #999;
              padding: 20px;
              margin: 20px;
              border-radius: 10px;
              box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
          }
      </style>
  `;
  let lastFileName = '';
  let lastModuleName = '';
  let moduleOpen = false;
  let functionOpen = false;

  data.forEach(item => {
      if (item.fileName !== lastFileName) {
          if (lastFileName) {
              if (functionOpen) {
                  html += '</div>\n';
                  functionOpen = false;
              }
              if (moduleOpen) {
                  html += '</div>\n';
                  moduleOpen = false;
              }
              html += '</div></section>\n';
          }
          markdown += `# File: [${item.fileName}](#${item.fileName.replace('.', '')})\n`;
          html += `<section id="${item.fileName.replace('.', '')}">\n<div class="file-card">\n<h1>File: ${item.fileName}</h1>\n`;
          lastFileName = item.fileName;
      }

      if (item.doc.module && item.doc.module[0].description !== lastModuleName) {
          if (lastModuleName) {
              if (functionOpen) {
                  html += '</div>\n';
                  functionOpen = false;
              }
              if (moduleOpen) {
                  html += '</div>\n';
                  moduleOpen = false;
              }
          }
          markdown += `## Module: [${item.doc.module[0].description}](#${item.doc.module[0].description.replace('.', '')})\n`;
          html += `<div id="${item.doc.module[0].description.replace('.', '')}" class="card">\n<h2>Module: ${item.doc.module[0].description}</h2>\n`;
          lastModuleName = item.doc.module[0].description;
          moduleOpen = true;
      }

      if (item.doc.function) {
          if (functionOpen) {
              html += '</div>\n';
          }
          markdown += `### Function: [${item.doc.function[0].description}](#${item.doc.function[0].description.replace('.', '')})\n`;
          html += `<div id="${item.doc.function[0].description.replace('.', '')}" class="card">\n<h3>Function: ${item.doc.function[0].description}</h3>\n`;
          functionOpen = true;
      }

      Object.entries(item.doc).forEach(([key, valArray]) => {
          if (key !== 'module' && key !== 'function') {
              valArray.forEach(val => {
                  markdown += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${val.description}\n`;
                  if (key === 'memberof' || key === 'requires') {
                      let link = val.description.replace('.', '');
                      html += `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <a href="#${link}">${val.description}</a></li>\n`;
                  } else {
                      html += `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val.description}</li>\n`;
                  }
              });
          }
      });

      markdown += `**Created Date:** ${item.createdDate}\n`;
      markdown += `**Modified Date:** ${item.modifiedDate}\n\n`;

      html += `<li><strong>Created Date:</strong> ${item.createdDate}</li>\n`;
      html += `<li><strong>Modified Date:</strong> ${item.modifiedDate}</li>\n`;
  });

  if (functionOpen) {
      html += '</div>\n';
  }
  if (moduleOpen) {
      html += '</div>\n';
  }
  if (lastFileName) {
      html += '</div></section>\n';
  }

  return { markdown, html };
}

module.exports = convertJsonToDocs;
