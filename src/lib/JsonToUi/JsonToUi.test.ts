/**
 * @file index.js
 * @namespace JsonToUi
 * @module JsonToUi.Test
 * @memberof namespace:build-docs.JsonToUi
 * 
 */

import { DataItem } from '../types';
const JsonToUi = require('./index.ts');
const { writeFileSync } = require('fs');
const data = require('./TestData.json');

function  main( data:DataItem[] ){
  try {
    let run = new JsonToUi(data as any);
    console.log('ProcessData', run.processedData)
    writeFileSync('./.dist/JsonToUi/sourceData.json', JSON.stringify(run.data, null, 2));
    writeFileSync('./.dist/JsonToUi/processedData.json', JSON.stringify(run.processedData, null, 2));
    
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