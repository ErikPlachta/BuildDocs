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

/**
 *
 *
 * @export
 * @interface ProcessedDataItem
 * @since 2021-07-14
 * @version 0.0.1
 * @access public
 * @namespace {ProcessedDataItem | build-docs.Types.ProcessedDataItem}
 * @memberof namespace:build-docs.Types
 * @property {string} id - The id of the item.
 * @property {object} fileDetails - The details of the file.
 * @property {string} fileDetails.fileName - The name of the file.
 * @property {string} fileDetails.filePath - The path of the file.
 * @property {string} fileDetails.createdDate - The date the file was created.
 * @property {string} fileDetails.modifiedDate - The date the file was last modified.
 * @property {boolean} isFile - Whether the item is a file.
 * @property {boolean} isNamespace - Whether the item is a namespace.
 * @property {boolean} isClass - Whether the item is a class.
 * @property {boolean} isModule - Whether the item is a module.
 * @property {Comment[]} memberOf - The comments that the item is a member of.
 * @property {object} dataSets - HTML data attribute values, dataSets, for the item.
 *
 * @property {string | 'nav-header' | 'content'  | 'container' | 'tab-strip'  | 'tab-strip-nav'} dataSets.role - The role of the item within the page.
 * @property {string | 'overview' | 'about'  } dataSets.group - The group of the content within the rendered content. Some defaults that always generated. Dynamic for all modules after that.
 * @property {string | 'overview' | 'details' | 'changelog'} dataSets.subGroup - The subGroup of the item.
 * @property {string} dataSets.id - The id is the unique ID to connect tab-strip-nav to it's related content to display. For example, `overview-summary` is the id for the overview tab and the overview content.
 *
 */
export interface ProcessedDataItem {
	id: string;
	fileDetails: {
		fileName: string;
		filePath: string;
		createdDate: string;
		modifiedDate: string;
	};

	// relatedComments: string[];
	isFile: boolean;
	isNamespace: boolean;
	isClass: boolean;
	isModule: boolean;
	memberOf: Comment[];

	//-- HTML Data Attribute Values for grouping content.
	dataSets?: {
		role: string | 'nav-header' | 'content'  | 'container' | 'tab-strip'  | 'tab-strip-nav'
		group: string | 'overview' | 'changelog' | 'about'  
		subGroup: string; // 'stats'
		id: string;
	};
}
