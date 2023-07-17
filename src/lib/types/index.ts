/**
 * @file index.ts
 * @path build-docs/types/index.ts
 * @fileoverview Types for the library.
 * @package build-docs
 * @module build-docs.Types
 * @access private
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

export type DataItem = {
	id: string;
	fileName: string;
	filePath: string;
	doc: Doc;
	createdDate: string;
	modifiedDate: string;
	relatedComments: string[];
}


export type Namespace = {
	id: string;
	value: string;
}

export type Module = {
	id: string;
	value: string;
}

/**
 * @export
 * @interface ProcessedDataItem
 * @since 2021-07-14
 * @version 0.0.1
 * @access public
 * @namespace {ProcessedDataItem | build-docs.Types.ProcessedDataItem}
 * @memberof namespace:build-docs.Types
 * @property {string} id - Unique ID to bed used in DOM.
 * @property {object} fileDetails - The details of the file.
 * @property {string} fileDetails.fileName - The name of the file.
 * @property {string} fileDetails.filePath - The path of the file.
 * @property {string} fileDetails.createdDate - The date the file was created.
 * @property {string} fileDetails.modifiedDate - The date the file was last modified.
 * @property {string[]} namespaces - The namespaces related to this item.
 * @property {string[]} modules - The modules related to this item.
 * @property {object[]} memberOf - The memberOf related to this item.
 * @property {string[]} parentId - The parent id to this item.
 * @property {string[]} siblingIds - The sibling IDs related tot his item.
 * @property {string[]} childrenIds - The children IDs related to this item.
 * @property {ContentToRender} dataToRender - The data to render within UI.
 */
export interface ProcessedDataItem {
	id: string;
  // doc: Doc;
	fileDetails: {
		fileName: string;
		filePath: string;
		createdDate: string;
		modifiedDate: string;
	};

  namespaces : string[];
  modules : string[];
  memberOf: {
    type : string,
    value : string
  }[]

	// isClass: boolean;
	// isModule: boolean;
  parentId: this['id'][]
  siblingIds: this['id'][]
  childrenIds: this['id'][]
  dataToRender : ContentToRender
}


/**
 * @export
 * @interface ContentToRender
 * @since 2021-07-14
 * @version 0.0.1
 * @access public
 * @memberof build-docs.Types
 * @property {object} dataSets - HTML data attribute values, dataSets, for the item.
 * @property {string | 'nav-header' | 'content'  | 'container' | 'tab-strip'  | 'tab-strip-nav'} dataSets.role - The role of the item within the page.
 * @property {string | 'overview' | 'about'  } dataSets.group - The group of the content within the rendered content. Some defaults that always generated. Dynamic for all modules after that.
 * @property {string | 'overview' | 'details' | 'changelog'} dataSets.subGroup - The subGroup of the item.
 * @property {string} dataSets.id - The id is the unique ID to connect tab-strip-nav to it's related content to display. For example, `overview-summary` is the id for the overview tab and the overview content.
 */
export type ContentToRender ={

  type : string |  "title" | 'sub-title',
  value : string,
  
  //-- HTML Data Attribute Values for grouping content.
	dataSets: {
    //-- Role of content
    role: string | 'nav-header' | 'content'  | 'container' | 'tab-strip'  | 'tab-strip-nav'
		//-- Tagging and association of content in nav-header to the main container.
    group: string | 'overview' | 'changelog' | 'about'  
		//-- Category of content. ( to get all stats for all module could query this.)
    subGroup: string; // 'stats'
		//-- Unique ID to connect tab-strip-nav to it's related content to display. For example, `overview-summary` is the id for the overview tab and the overview content.
    id: string;
	};
}

