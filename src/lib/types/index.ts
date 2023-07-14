/**
 * @file index.ts
 * @path build-docs/types/index.ts
 * @fileoverview Types for the library.
 * @package build-docs
 * @module build-docs
 * @access private
 * @namespace {Types | build-docs.Types}
 * @version 0.0.1
 * @since 2021-07-14
 * @license MIT
 * 
 */

export interface Comment {
  line: string;
  type: string;
  description: string;
}

export interface Doc {
  [key: string]: Comment[];
}

export interface DataItem {
  id: string;
  fileName: string;
  filePath: string;
  doc: Doc;
  createdDate: string;
  modifiedDate: string;
  relatedComments: string[];
}

export interface ProcessedDoc {
  [key: string]: string[];
}

export interface ProcessedDataItem {
  id: string;
  fileName: string;
  filePath: string;
  doc: ProcessedDoc;
  createdDate: string;
  modifiedDate: string;
  relatedComments: string[];
}

