/* eslint-disable @typescript-eslint/no-var-requires */
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
const data = require('../../../.dist/docs.json');
// const data = require('./TestData.json');

function  main( data:DataItem[] ){
  try {
    const run = new JsonToUi(data);
    
    writeFileSync('./.dist/JsonToUi/sourceData.json', JSON.stringify(run.data, null, 2));
    writeFileSync('./.dist/JsonToUi/processedData.json', JSON.stringify(run.processedData, null, 2));
    writeFileSync('./.dist/JsonToUi/modules.json', JSON.stringify(run.modules, null, 2));
    writeFileSync('./.dist/JsonToUi/namespaces.json', JSON.stringify(run.namespaces, null, 2));
    console.log('namespaces: ', run.namespaces)
    
    // writeFileSync('test.md', markdown);
    // writeFileSync('test.html', html);
    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}

main(data)
