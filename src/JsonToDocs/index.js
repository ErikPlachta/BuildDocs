const convertJsonToDocs = require('./JsonToDoc.js');
const fs = require('fs');
const data = require('./data.json');

let { markdown, html } = convertJsonToDocs(data)

fs.writeFileSync('test.md', markdown);
fs.writeFileSync('test.html', html);
