import { Config } from '../types'

export const config: Config = {
  title: 'config.json',
  namespace: 'build-docs',
  version: '0.1.4',
  author: 'Erik Plachta',
  summary: 'Options used by `build-docs` to determine run behavior.',
  description:
    'Config options used by `build-docs` to control the overall operations and behavior of the module. This includes the ability to enable/disable features, and set default values.',
  settings: [
    {
      title: 'Logging',
      summary: 'Settings for logging behavior.',
      description: 'How build-docs should handle logging, including output location and level.',
      options: [
        {
          title: 'level',
          description: 'The level of logging to output to file and/or console depending on config. 0 = None, 1 = Fatal, 2 = Error, 3 = Warn, 4 = Debug, 5 = Info.',
          type: 'string',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Info',
              description: 'Log all info, debug, warn, error, and fatal messages.',
              value: 5,
            },
          ],
          supported: [
            {
              title: 'Info',
              description: 'Log all info, debug, warn, error, and fatal messages.',
              value: 5,
            },
            {
              title: 'Debug',
              description: 'Log all debug, warn, error, and fatal messages.',
              value: 4,
            },
            {
              title: 'Warn',
              description: 'Log all warn, error, and fatal messages.',
              value: 3,
            },
            {
              title: 'Error',
              description: 'Log all error, and fatal messages.',
              value: 2,
            },
            {
              title: 'Fatal',
              description: 'Log only fatal messages.',
              value: 1,
            },
            {
              title: 'None',
              description: 'Log only fatal messages.',
              value: 0,
            },
          ],
          memberOf: 'build-docs',
          dependentOn: ['settings/logging/options/logToFile', 'settings/logging/options/logToConsole'],
        },
        {
          title: 'toConsole',
          description: 'Should build-docs print logging to console.',
          type: 'boolean',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Enabled',
              description: 'Enable logging to console.',
              value: true,
            },
          ],
          supported: [
            {
              title: 'Enabled',
              description: 'Enable logging to console.',
              value: true,
            },
            {
              title: 'Disabled',
              description: 'Disable logging to console.',
              value: false,
            },
          ],
          memberOf: 'build-docs',
          dependentOn: ['settings/logging/options/logLevel'],
        },
        {
          title: 'toFile',
          description: 'Enable or disable logging to a file.',
          type: 'boolean',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Enabled',
              description: 'Enable logging to a file.',
              value: true,
            },
          ],
          memberOf: 'build-docs',
        },
        {
          title: 'filePath',
          description: 'Where to write log file(s).',
          type: 'string',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Logs',
              description: 'Save results in build-docs target output path `/logs`.',
              value: 'logs',
            },
          ],
        },
        {
          title: 'fileName',
          description: 'Name of the log file(s).',
          type: 'string',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Date-Time-Long',
              description: 'The date and time the log file was created.',
              value: 'YYYY-DD-MM-HH:MM:SS:ms',
            },
          ],
          supported: [
            //TODO: Update these to populate dynamically.
            {
              title: 'Date-Time-Long',
              description: 'The date and time the log file was created.',
              value: 'YYYY-DD-MM-HH:MM:SS:ms',
            },
            {
              title: 'Date-Time-Short',
              description: 'The date and time the log file was created.',
              value: 'YYYY-DD-MM-HH:MM:SS',
            },
            {
              title: 'Date-Long',
              description: 'The date the log file was created.',
              value: 'YYYY-DD-MM',
            },
            {
              title: 'Date-Short',
              description: 'The date the log file was created.',
              value: 'YYYY-DD',
            },
            {
              title: 'Time-Long',
              description: 'The time the log file was created.',
              value: 'HH:MM:SS:ms',
            },
            {
              title: 'Time-Short',
              description: 'The time the log file was created.',
              value: 'HH:MM:SS',
            },
            {
              title: 'Target Root + Date-Time-Long',
              description: 'The target root path and date and time the log file was created.',
              value: 'targetRoot/YYYY-DD-MM-HH:MM:SS:ms',
            },
          ],
        },
        {
          title: 'fileFormat',
          description: 'Output format to be used for build-docs.',
          type: 'string[]',
          required: true,
          enabled: true,
          value: null,
          memberOf: 'build-docs', // TODO: verify this.
          default: [
            {
              title: 'JSON',
              description: 'Save log file(s) in JSON format.',
              value: 'json',
            },
          ],
          // "json", "txt"
          supported: [
            {
              title: 'JSON',
              description: 'Save log file(s) in JSON format.',
              value: 'json',
            },
            {
              title: 'Text',
              description: 'Save log file(s) in text format.',
              value: 'txt',
            },
          ],
        },
        {
          title: 'fileWriteMode',
          description: 'If a file already exists behavior, and option to make unique.',
          type: 'string',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Overwrite',
              description:
                'Opens file for overwrite and replaces all existing content. The file is created if it does not exist.',
              value: 'overwrite',
            },
          ],
          // "overwrite", "append", "prepend", "new"
          supported: [
            {
              title: 'Overwrite',
              description: 'Opens file for overwrite. The file is created if it does not exist.',
              value: 'overwrite',
            },
            {
              title: 'Append',
              description: 'Opens file for appending. The file is created if it does not exist.',
              value: 'append',
            },
            {
              title: 'Prepend',
              description: 'Opens file for prepending. The file is created if it does not exist.',
              value: 'prepend',
            },
            {
              title: 'New',
              description: 'Always builds a a new file with a unique id of date-time.',
              value: 'new',
            },
          ],
          reference: 'https://nodejs.dev/en/api/v20/fs/#file-system-flags',
        },
      ],
    },
    {
      title: 'Output',
      summary: 'Config options build-docs output behavior.',
      description:
        'Options for where build-docs will generate the results, the filename, and what format to generate them in.',
      options: [
        {
          title: 'outputPath',
          description:
            'Output options to be used build-docs. Default is the root of where it was executed from `.dist`.',
          type: 'string',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Current Directory `/.dist`',
              description: 'The current directory where build-docs was executed from.',
              value: './.dist',
            }
          ],
        },
        {
          title: 'outputName',
          description: 'Output name to be used for build-docs.',
          type: 'string',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Target Root Directory_comments',
              description: 'The name of the output file.',
              value : 'TARGET_ROOT_DIRECTORY_comments'
            },
          ],
          supported : [
            {
              title: 'Target Root Directory_comments',
              description: 'The name of the output file.',
              value : 'TARGET_ROOT_DIRECTORY_comments'
            },
          ]
        },
        {
          title: 'outputFormat',
          description: 'Output format to be used for build-docs.',
          type: 'string[]',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'JSON',
              description: 'Save results in JSON format.',
              value: 'json',
            }
          ],
          supported: [
            {
              title: 'JSON',
              description: 'Save results in JSON format.',
              value: 'json',
            },
            {
              title: 'Markdown',
              description: 'Save results in Markdown format.',
              value: 'md',
            },
            {
              title: 'HTML',
              description: 'Save results in HTML format.',
              value: 'html',
            }
          ],
        },
        {
          title: 'writeMode',
          description: 'If a file already exists behavior, and option to make unique.',
          type: 'string',
          required: false,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Overwrite',
              value: 'overwrite',
              description:
                'Opens file for overwrite and replaces all existing content. The file is created if it does not exist.',
            },
          ],
          reference: 'https://nodejs.dev/en/api/v20/fs/#file-system-flags',
          memberOf: 'build-docs.generateDocs',
          supported: [
            {
              title: 'Overwrite',
              description: 'Opens file for overwrite. The file is created if it does not exist.',
              value: 'overwrite',
            },
            {
              title: 'Append',
              description: 'Opens file for appending. The file is created if it does not exist.',
              value: 'append',
            },
            {
              title: 'Prepend',
              description: 'Opens file for prepending. The file is created if it does not exist.',
              value: 'prepend',
            },
            {
              title: 'New',
              description: 'Always builds a a new file with a unique id of date-time.',
              value: 'new',
            },
          ],
        },
      ],
    },
    {
      title: 'Target',
      summary: 'Where to look and the type of files to should be looking for docs.',
      description:
        'Manage the location(s) to search within, location(s) to ignore, file types to look for, and file types to ignore.',
      options: [
        {
          title: 'targetPath',
          description: 'The root directory to search for documentation within by build-docs.',
          type: 'string',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Current Directory',
              description: 'The current directory where build-docs was executed from.',
              value: './',
            },
          ],
          memberOf: 'build-docs.generateDocs',
        },
        {
          title: 'targetPaths',
          description: 'Optional Paths to be used for build-docs. (not yet built out)',
          type: 'string[]',
          required: false,
          enabled: false,
          value: null,
          default: [],
        },
        {
          title: 'targetFileTypes',
          description: 'The file types to extract build documentation from.',
          type: 'string[]',
          required: true,
          enabled: true,
          value: null,
          default: [
            {
              title: 'JavaScript',
              description: 'Look for docs within JavaScript files',
              value: 'js',
            },
            {
              title: 'TypeScript',
              description: 'Look for docs within TypeScript files',
              value: 'ts',
            },
          ],
          supported: [
            {
              title: 'JavaScript',
              description: 'Look for docs within JavaScript files',
              value: 'js',
            },
            {
              title: 'TypeScript',
              description: 'Look for docs within TypeScript files',
              value: 'ts',
            },
          ],
        },
        {
          title: 'ignoreFiles',
          description: 'Files to ignore when building documentation.',
          type: 'string[]',
          required: false,
          enabled: false,
          value: null,
          default: [],
        },
        {
          title: 'targetFiles',
          description: 'Array of specific files to target',
          type: 'string[]',
          required: false,
          enabled: false,
          value: null,
          default: [],
        },
        {
          title: 'ignorePaths',
          description: 'Paths to ignore when building documentation.',
          type: 'string[]',
          required: false,
          enabled: true,
          value: null,
          default: [
            {
              title: 'Node Modules',
              description: 'Ignore node_modules directory',
              value: 'node_modules',
            },
            {
              title: 'Archive',
              description: 'Ignore _ARCHIVE directory anywhere within target root path.',
              value: '_ARCHIVE',
            },
            
            {
              title: 'Thunder Client',
              description: 'Ignore _thunder-client, a VS Code extension, directory.',
              value: '_thunder-client',
            },
            {
              title: 'VS Code',
              description: 'Ignore .vscode directory anywhere within target root path.',
              value: '.vscode',
            },
            {
              title: 'Build Docs',
              description: 'Ignore build-docs_v1 directory anywhere within target root path.',
              value: 'build-docs_v1',
            },
          ],
        },
      ],
    },
  ],
}

export default config