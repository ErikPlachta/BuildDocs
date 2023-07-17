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
};

export type Namespace = {
	id: string;
	value: string;
};

export type Module = {
	id: string;
	value: string;
};

/**
 * @typedef {Object} ProcessedDataItem
 */
export interface ProcessedDataItem {
	id: string;
	access: null | string | "public" | "private" | "protected";
	summary: string | null;
	description: string | null;

	//-- type of item.
	type?: {
		type: string; // between `{}`
		description: string; // after `}` and sometimes `-`
	} | null;

	author?: string | null;
	license?: string | null;
	version?: string | null;
	changelog: void | string[];

	returns?: {
		type: string; // between `{}`
		description: string; // after `-`
	};

	throws?: {
		type: string; // between `{}`
		description: string; // after `-`
	};
	example: void | string[];
	related?: string[];
	see?: string[];

	todo?: void | string[];

	bug?: void | string[];

	argument:
		| {
				type: string; // between `{}`
				name: string; // between `[]`
				description: string; // after `-`
		  }[]
		| void;

	requires:
		| {
				// type: string | "module" | "namespace" | "function"; //-- before `:`
				// name: string; // after `:` and before `-`
				description: string; // after `-`
		  }[]
		| void;

	param:
		| {
				type: string; // between `{}`
				name: string; // between `[]`
				description: string; // after `-`
		  }[]
		| void;

	isFile?: boolean;

	fileDetails: {
		fileName: string;
		filePath: string;
		createdDate: string;
		modifiedDate: string;
	};

	namespaces: string[];
	modules: string[];

	memberOf?: {
		type: string;
		value: string;
	}[];

	// isClass: boolean;
	// isModule: boolean;
	parentId: this["id"][];
	childrenId: this["id"][];
	// dataToRender: dataToRender;

	// Optionally add the original doc object for debugging.
	doc?: Doc;
}

/**
 * @export
 * @interface DataToRender
 * @since 2021-07-14
 * @version 0.0.1
 * @access public
 * @memberof module:build-docs.Types
 * @property {object} dataSets - HTML data attribute values, dataSets, for the item.
 * @property {string | 'nav-header' | 'content'  | 'container' | 'tab-strip'  | 'tab-strip-nav'} dataSets.role - The role of the item within the page.
 * @property {string | 'overview' | 'about'  } dataSets.group - The group of the content within the rendered content. Some defaults that always generated. Dynamic for all modules after that.
 * @property {string | 'overview' | 'details' | 'changelog'} dataSets.subGroup - The subGroup of the item.
 * @property {string} dataSets.id - The id is the unique ID to connect tab-strip-nav to it's related content to display. For example, `overview-summary` is the id for the overview tab and the overview content.
 */
export type DataToRender = {
	type: null | string | "function" | "const" | "class" | "file";
	value: null | string;

	//-- HTML Data Attribute Values for grouping content.
	dataSets: {
		//-- Role of content
		role:
			| null
			| string
			| "nav-header"
			| "content"
			| "container"
			| "tab-strip"
			| "tab-strip-nav";
		//-- Tagging and association of content in nav-header to the main container.
		group: null | string | "overview" | "changelog" | "about";
		//-- Category of content. ( to get all stats for all module could query this.)
		subGroup: null | string; // 'stats'
		//-- Unique ID to connect tab-strip-nav to it's related content to display. For example, `overview-summary` is the id for the overview tab and the overview content.
		id: null | string;
	};
};
