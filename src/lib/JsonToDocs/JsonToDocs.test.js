/**
 * @file index.js
 * @namespace JsonToDocs
 * @module JsonToDocs.Test
 * @memberof namespace:build-docs.JsonToDocs
 * 
 */


import JsonToDocs from './index.ts';
import { writeFileSync } from 'fs';
import data from './TestData.json';

let { markdown, html } = JsonToDocs(data)

writeFileSync('test.md', markdown);
writeFileSync('test.html', html);


