/**
 * @type {import("eslint").Linter.Config}
 * @see https://eslint.org/docs/user-guide/configuring
 * 
 * @param {import("eslint").Linter.Config} config
 * @returns {import("eslint").Linter.Config}
 * 
 * @see https://eslint.org/docs/user-guide/configuring
 * 
 * @prop {object} config - ESLint configuration object
 * @prop {object} config.env - environment settings. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments.
 * @prop {string} config.env.browser - Use browser globals. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments.
 * @prop {string} config.env.commonjs - Use CommonJS globals and CommonJS scoping. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments.
 * @prop {string} config.env.es2021 - Use ECMAScript 2021 globals. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments.    
 * @prop {object} config.extends - configuration sets. See https://eslint.org/docs/user-guide/configuring/language-options#extending-configuration-files.
 * @prop {string} config.extends.eslint:recommended - Use the recommended rules from eslint. See https://eslint.org/docs/user-guide/configuring/language-options#extending-configuration-files.    
 * @prop {string} config.extends.plugin:@typescript-eslint/recommended - Use the recommended rules from @typescript-eslint/eslint-plugin. See https://eslint.org/docs/user-guide/configuring/language-options#extending-configuration-files.
 * @prop {object} config.globals - global variables. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals.
 * @prop {object} config.plugins - Plugins used by eslint. See https://eslint.org/docs/user-guide/configuring/language-options#configuring-plugins.
 * @prop {object} config.overrides - Override configuration options. See https://eslint.org/docs/user-guide/configuring/language-options#configuring-overrides.
 * @prop {object} config.overrides.env - environment settings. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments.    
 * @prop {string} config.overrides.env.node - Use Node.js globals. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments.
 * @prop {object} config.overrides.files - Specify which files to apply the configuration to. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals.
 * @prop {string} config.overrides.files.eslintrc.{js,cjs} - Use the configuration for .eslintrc.js and .eslintrc.cjs files. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals.
 * @prop {string} config.parser @typescript-eslint/parser - Use the parser from @typescript-eslint/parser. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-parser.
 * @prop {object} config.parserOptions - parser settings. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-parser-options.
 * @prop {string} config.parserOptions.ecmaVersion - Define the ecmaVersion to use. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-parser-options. 
 * @prop {object} config.parserOptions - parser settings. See https://eslint.org/docs/user-guide/configuring/language-options#specifying-parser-options.
 * @prop {object} config.rules - rules. See https://eslint.org/docs/user-guide/configuring/rules.
 * @prop {string} config.rules.no-unused-vars - disallow unused variables. See https://eslint.org/docs/user-guide/configuring/rules#disallow-unused-variables-no-unused-vars.
 * @prop {string} config.rules.@typescript-eslint/no-unused-vars - disallow unused variables. See https://eslint.org/docs/user-guide/configuring/rules#disallow-unused-variables-no-unused-vars.   
 * @prop {string} config.rules.@typescript-eslint/consistent-type-definitions - enforce using type for object type definitions. See ??,
 *
 */
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        // "es2021": true,
        "dom": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        'prettier/@typescript-eslint',
    ],
    "globals": {},
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "@typescript-eslint",
        "prettier",
        "eslint-config-prettier",
        "eslint-plugin-prettier"
    ],
    "rules": {
        // "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        // to enforce using type for object type definitions, can be type or interface 
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
}