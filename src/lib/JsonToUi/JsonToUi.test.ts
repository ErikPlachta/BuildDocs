/**
 * @file index.js
 * @namespace JsonToUi
 * @module JsonToUi.Test
 * @memberof namespace:build-docs.JsonToUi
 * 
 */

import { DataItem, ProcessedDataItem } from '../types';
const JsonToUi = require('./index.ts');
const { writeFileSync } = require('fs');
const data = require('./TestData.json');

function  main( data:DataItem[] ){
  try {
    let ProcessData = new JsonToUi(data as any);
    console.log('ProcessData', ProcessData.processedData)
    writeFileSync('./.dist/JsonToUi/sourceData.json', JSON.stringify(ProcessData.data, null, 2));
    writeFileSync('./.dist/JsonToUi/processedData.json', JSON.stringify(ProcessData.processedData, null, 2));
    // console.log('markdown, html', markdown, html)
    // writeFileSync('test.md', markdown);
    // writeFileSync('test.html', html);
    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}

main( data )