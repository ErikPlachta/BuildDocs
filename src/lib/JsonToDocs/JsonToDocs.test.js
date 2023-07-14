/**
 * @file index.js
 * @namespace JsonToDocs
 * @module JsonToDocs.Test
 * @memberof namespace:build-docs.JsonToDocs
 * 
 */


const convertJsonToDocs = require('./JsonToDoc.js');
const fs = require('fs');
const data = require('./data.json');

let { markdown, html } = convertJsonToDocs(data)

fs.writeFileSync('test.md', markdown);
fs.writeFileSync('test.html', html);


/**
 * Sample data to test integrity of JsonToDocs utility.
 * @type {Array.<Object>}
 * @memberof namespace:build-docs.JsonToDocs
 */
const data = [
  {
    "id": "dc5a59f5-3873-453c-ad47-f7a6ed4b7d36",
    "fileName": "index.js",
    "filePath": "utils\\build-docs\\test\\index.js",
    "doc": {
      "type": [
        {
          "line": "@type {file} index.js",
          "type": "type",
          "description": "{file} index.js"
        }
      ],
      "access": [
        {
          "line": "@access public",
          "type": "access",
          "description": "public"
        }
      ],
      "module": [
        {
          "line": "@module BuildDocs.test",
          "type": "module",
          "description": "BuildDocs.test"
        }
      ],
      "summary": [
        {
          "line": "@summary Javascript file to test integrity of BuildDocs.",
          "type": "summary",
          "description": "Javascript file to test integrity of BuildDocs."
        }
      ],
      "file": [
        {
          "line": "@file index.js",
          "type": "file",
          "description": "index.js"
        }
      ],
      "version": [
        {
          "line": "@version 0.1.0",
          "type": "version",
          "description": "0.1.0"
        }
      ]
    },
    "createdDate": "2023-07-13T18:45:23.557Z",
    "modifiedDate": "2023-07-13T20:56:05.023Z",
    "relatedComments": []
  },
  {
    "id": "74d6bbb8-ade1-4395-9e72-5cc974527aba",
    "fileName": "index.js",
    "filePath": "utils\\build-docs\\test\\index.js",
    "doc": {
      "type": [
        {
          "line": "@type {function} main",
          "type": "type",
          "description": "{function} main"
        }
      ],
      "access": [
        {
          "line": "@access private",
          "type": "access",
          "description": "private"
        }
      ],
      "function": [
        {
          "line": "@function main",
          "type": "function",
          "description": "main"
        }
      ],
      "requires": [
        {
          "line": "@requires {@link https://nodejs.org/api/fs.html#fs_file_system | fs}",
          "type": "requires",
          "description": "{@link https://nodejs.org/api/fs.html#fs_file_system | fs}"
        },
        {
          "line": "@requires {@link ./Module.ts | Module}",
          "type": "requires",
          "description": "{@link ./Module.ts | Module}"
        }
      ],
      "memberof": [
        {
          "line": "@memberof BuildDocs.test",
          "type": "memberof",
          "description": "BuildDocs.test"
        }
      ],
      "summary": [
        {
          "line": "@summary Main function for test.",
          "type": "summary",
          "description": "Main function for test."
        }
      ],
      "description": [
        {
          "line": "@description Main function for test.",
          "type": "description",
          "description": "Main function for test."
        }
      ],
      "param": [
        {
          "line": "@param {boolean} [DEBUG=true] - `Optional` Debug flag.",
          "type": "param",
          "description": "{boolean} [DEBUG=true] - `Optional` Debug flag."
        }
      ],
      "returns": [
        {
          "line": "@returns {boolean} - Returns true if test passes.",
          "type": "returns",
          "description": "{boolean} - Returns true if test passes."
        }
      ]
    },
    "createdDate": "2023-07-13T18:45:23.557Z",
    "modifiedDate": "2023-07-13T20:56:05.023Z",
    "relatedComments": []
  },
  {
    "id": "41bb133c-8965-41e5-b796-67cc67d9c6d1",
    "fileName": "Module.ts",
    "filePath": "utils\\build-docs\\test\\Module.ts",
    "doc": {
      "type": [
        {
          "line": "@type {file} Module.ts",
          "type": "type",
          "description": "{file} Module.ts"
        }
      ],
      "access": [
        {
          "line": "@access private",
          "type": "access",
          "description": "private"
        }
      ],
      "module": [
        {
          "line": "@module BuildDocs.test",
          "type": "module",
          "description": "BuildDocs.test"
        }
      ],
      "file": [
        {
          "line": "@file Module.js",
          "type": "file",
          "description": "Module.js"
        }
      ],
      "summary": [
        {
          "line": "@summary Javascript file to test integrity of BuildDocs.",
          "type": "summary",
          "description": "Javascript file to test integrity of BuildDocs."
        }
      ],
      "version": [
        {
          "line": "@version 0.1.0",
          "type": "version",
          "description": "0.1.0"
        }
      ]
    },
    "createdDate": "2023-07-13T18:46:28.605Z",
    "modifiedDate": "2023-07-13T20:56:18.674Z",
    "relatedComments": []
  },
  {
    "id": "677b3741-af10-4ff1-a867-412179d829e5",
    "fileName": "Module.ts",
    "filePath": "utils\\build-docs\\test\\Module.ts",
    "doc": {
      "type": [
        {
          "line": "@type {function} run",
          "type": "type",
          "description": "{function} run"
        }
      ],
      "access": [
        {
          "line": "@access private",
          "type": "access",
          "description": "private"
        }
      ],
      "function": [
        {
          "line": "@function run",
          "type": "function",
          "description": "run"
        }
      ],
      "memberof": [
        {
          "line": "@memberof BuildDocs.test",
          "type": "memberof",
          "description": "BuildDocs.test"
        }
      ],
      "usedby": [
        {
          "line": "@usedby utils\\build-docs\\test\\index.js",
          "type": "usedby",
          "description": "utils\\build-docs\\test\\index.js"
        }
      ],
      "summary": [
        {
          "line": "@summary Main function for test.",
          "type": "summary",
          "description": "Main function for test."
        }
      ],
      "param": [
        {
          "line": "@param {boolean} DEBUG - Whether or not to run in debug mode.",
          "type": "param",
          "description": "{boolean} DEBUG - Whether or not to run in debug mode."
        }
      ],
      "returns": [
        {
          "line": "@returns {boolean} Returns true.",
          "type": "returns",
          "description": "{boolean} Returns true."
        }
      ]
    },
    "createdDate": "2023-07-13T18:46:28.605Z",
    "modifiedDate": "2023-07-13T20:56:18.674Z",
    "relatedComments": []
  }
]
