/**
 * @file index.ts - Contains class for converting JSON data generated by BuildDocs module into markdown and/or HTML.
 * @access private
 * @namespace {build-docs.JsonToUi}
 * @module JsonToUi
 * @memberof namespace:build-docs
 */

import { DataItem, ProcessedDataItem, Namespace, Module } from "../types";

/**
 * @access private
 * @memberof module:JsonToUi
 * @memberof namespace:build-docs.JsonToUi
 * @classdesc Converting JSON data generated by BuildDocs module into markdown and/or HTML.
 */
/**
 * Class to convert JSON data to Markdown and HTML
 */
class JsonToUi {
	data: DataItem[];
	files: string[];
	namespaces: Namespace[];
	modules: Module[];
	processedData: ProcessedDataItem[] | undefined;

	/**
	 * @param {DataItem[]} data - The JSON data to convert
	 */
	constructor(data: DataItem[]) {
		this.data = data;
		this.files = [];
		this.namespaces = [];
		this.modules = [];
		this.processedData = this.processData(data);
	}

	addNamespace(namespace: { id: string; value: string }): void {
		this.namespaces.push(namespace);
	}

	/**
	 * Process data for easier use
	 * @param {DataItem[]} data - The data to process
	 * @return {ProcessedDataItem[]} The processed data
	 */
	processData(data: DataItem[]): ProcessedDataItem[] {
		const processedData: ProcessedDataItem[] = [];

		//-----------------------------
		// 1. First pass through all items to extract individual doc info.
		data.map((item: DataItem) => {
			processedData.push({
				id: item.id,
				fileDetails: {
					fileName: item.fileName,
					filePath: item.filePath,
					createdDate: item.createdDate,
					modifiedDate: item.modifiedDate,
				},
				//-- Extract description from comment for namespace(s)
				namespaces:
					item.doc?.namespace?.length > 0
						? item.doc?.namespace.map((namespace) => {
								const value = namespace?.description
									.replace("{", "")
									.replace("}", "");
								this.namespaces.push({ id: item.id, value: value });
								return value;
						  })
						: [],
				//-- Extract description from comment for module(s)
				modules:
					item.doc?.module?.length > 0
						? item.doc?.module.map((thisModule) => {
								const value = thisModule.description;
								this.modules.push({ id: item.id, value: value });
								return value;
						  })
						: [],
				memberOf:
					item.doc?.memberof?.length > 0
						? item.doc?.memberof.map((memberof) => {
								const value = memberof?.description.split(":");
								return {
									type: value[0],
									value: value[1],
								};
						  })
						: [],
				//-----------------------------
				//-- Creating empty values for the below, which will be populated on next pass.
				parentId: [],
				siblingId: [],
				childrenId: [],

				//-----------------------------
				//-- HTML data to be rendered.
				//TODO: build this into it once ready. ATM just a placeholder
				dataToRender: {
					type: "",
					value: "", //-- The description from the comment.
					dataSets: {
						role: "",
						group: "",
						subGroup: "",
						//-- Unique ID to connect tab-strip-nav to it's related content to display. For example, `overview-summary` is the id for the overview tab and the overview content.
						id: "",
					},
				},
			});
		});

		//-- Add all parents
		processedData.map((item: ProcessedDataItem) => {
			//-- If the item has a memberOf, then it is a child of another item.
			if (item.memberOf.length > 0) {
				item.memberOf.map((memberOf) => {
					//-- Assign relationships for namespaces
					if (memberOf.type === "namespace") {
						this.namespaces.map((namespace) => {
							if (namespace.value === memberOf.value) {
								//-- Add the parent id as the parent to the children
								item.parentId.push(namespace.id);

								//-- Find the parent and assign the child id to it
								processedData.map((parentItem: ProcessedDataItem) => {
									if (parentItem.id === namespace.id) {
										parentItem.childrenIds.push(item.id);
									}
								});
							}
						});
					} else if (memberOf.type === "module") {
						this.modules.map((module) => {
							if (module.value === memberOf.value) {
								//-- Add the parent id as the parent to the children
								item.parentId.push(module.id);

								//-- Find the parent and assign the child id to it
								processedData.map((parentItem: ProcessedDataItem) => {
									if (parentItem.id === module.id) {
										parentItem.childrenIds.push(item.id);
									}
								});
							}
						});
					}
				});
			}
		});
		return processedData;
	}

	/**
	 * Convert the data to Markdown
	 * @return {string} The Markdown string
	 * @todo Implement the method
	 */
	toMarkdown(): string {
		// Implement the method as before...
		return "";
	}

	/**
	 * Convert the data to HTML
	 * @return {string} The HTML string
	 * @todo Implement the method
	 */
	toHtml(
		title = "Placeholder Title",
		subTitle = "Placeholder subtitle for html."
	): string {
		return `${title} ${subTitle}`;
		// const bodyStart = `<html>
		//         <head>
		//             <title>${title}</title>
		//             <meta charset="utf-8" />
		//             <meta name="viewport" content="width=device-width, initial-scale=1" />
		//             <script src="https://cdn.tailwindcss.com"></script>
		//         </head>
		//         <body class="bg-gray-100 flex flex-col gap-8">`;

		// const getMainNav = ""; //todo: build this out

		// const buildHeader = `<header class="w-full p-0 m-0 px-4 pt-4 border-solid border-2 bg-white flex flex-col gap-4 max-w-8xl mx-auto">
		// 		<div class="max-w-4xl mx-auto w-full">
		// 				<h1 class="text-blue-500 text-4xl">
		// 						${title}
		// 				</h1>
		// 				<p class="text-gray-400">
		// 						${subTitle}
		// 				</p>
		// 		</div>
		// 		<nav>
		// 			<ul class="flex flex-row gap-6 mt-auto h-full">
		// 					<li class="py-2 px-4 border-solid border-b-4 border-blue-500 hover:border-blue-500/80"
		// 							data-role="nav-main"
		// 							data-group="overview"
		// 					>
		// 							<a href="#overview">Overview</a>
		// 				</li>` +
		// 		getMainNav() +
		// 		`</ul>
		// 		</nav>
		// 	</header>`
		// ;
	}
}

module.exports = JsonToUi;
