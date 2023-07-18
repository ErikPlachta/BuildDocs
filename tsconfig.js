/**
 * TypeScript Configuration for module.
 * @module tsconfig
 * @see https://www.typescriptlang.org/tsconfig
 * @param {boolean} compilerOptions.allowJs - Allow JavaScript files to be compiled. See [typescriptlang.org.org - AllowJs](https://www.typescriptlang.org/tsconfig#allowJs).
 * @param {object} compilerOptions - Compiler options for TypeScript.
 * @param {string} compilerOptions.baseUrl - Specify the base directory to resolve non-relative module names. See [typescriptlang.org.org - BaseUrl](https://www.typescriptlang.org/tsconfig#baseUrl).
 * @param {boolean} compilerOptions.composite - Enable constraints that allow a TypeScript project to be used with project references. See [typescriptlang.org.org - Composite](https://www.typescriptlang.org/tsconfig#composite).
 * @param {boolean} compilerOptions.esModuleInterop - Emit additional JavaScript to ease support for importing CommonJS modules. See [typescriptlang.org.org - EsModuleInterop](https://www.typescriptlang.org/tsconfig#esModuleInterop).
 * @param {boolean} compilerOptions.forceConsistentCasingInFileNames - Disallow inconsistently-cased references to the same file. See [typescriptlang.org.org - ForceConsistentCasingInFileNames](https://www.typescriptlang.org/tsconfig#forceConsistentCasingInFileNames).
 * @param {boolean} compilerOptions.incremental - Enable incremental compilation of types. See [typescriptlang.org.org - Incremental](https://www.typescriptlang.org/tsconfig#incremental).
 * @param {boolean} compilerOptions.isolatedModules - Transpile each file as a separate module (similar to 'ts.transpileModule'). See [typescriptlang.org.org - IsolatedModules](https://www.typescriptlang.org/tsconfig#isolatedModules).
 * @param {string} compilerOptions.jsx - Controls how JSX constructs are emitted in JavaScript files. This only affects output of JS files that started in .tsx files. See [typescriptlang.org.org - Jsx](https://www.typescriptlang.org/tsconfig#jsx).
 * @param {string[]} compilerOptions.lib - Specify library files to be included in the compilation. See [typescriptlang.org.org - Lib](https://www.typescriptlang.org/tsconfig#lib).
 * @param {boolean} compilerOptions.noEmit - Disable emitting files from a compilation to make from for prettier/eslint. See [typescriptlang.org.org - NoEmit](https://www.typescriptlang.org/tsconfig#noEmit).
 * @param {string} compilerOptions.module - Specify module code generation. See [typescriptlang.org.org - Module](https://www.typescriptlang.org/tsconfig#module).
 * @param {string} compilerOptions.moduleResolution - Module resolution is the process the compiler uses to figure out what an import refers to. See [typescriptlang.org.org - ModuleResolution](https://www.typescriptlang.org/tsconfig#moduleResolution), and [Module Resolution handbook](https://www.typescriptlang.org/docs/handbook/module-resolution.html) for additional details.
 * @param {boolean} compilerOptions.resolveJsonModule - Allows importing modules with a ‘.json’ extension, which is a common practice in node projects. This includes generating a type for the import based on the static JSON shape. See [typescriptlang.org.org - ResolveJsonModule](https://www.typescriptlang.org/tsconfig#resolveJsonModule).
 * @param {boolean} compilerOptions.skipLibCheck - Skip type checking of declaration files. See [typescriptlang.org.org - SkipLibCheck](https://www.typescriptlang.org/tsconfig#skipLibCheck).
 * @param {boolean} compilerOptions.strict - Enable all strict type checking options. See [typescriptlang.org.org - Strict](https://www.typescriptlang.org/tsconfig#strict).
 * @param {string} compilerOptions.target - Specify ECMAScript target version. Modern browsers support all ES6 features, so ES6 is a good choice. You might choose to set a lower target if your code is deployed to older environments, or a higher target if your code is guaranteed to run in newer environments. See [typescriptlang.org.org - Target](https://www.typescriptlang.org/tsconfig#target).
 * @param {string[]} exclude - Files to exclude from compilation. see [typescriptlang.org.org - Exclude](https://www.typescriptlang.org/tsconfig#exclude).
 * @param {string[]} include - Files to include in compilation. see [typescriptlang.org.org - Include](https://www.typescriptlang.org/tsconfig#include).
 * @param {string} references - Referenced projects.
 */
module.exports = {
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "./", // when set to ./, the compiler will look for modules in the same folder as this `tsconfig.json` file.
    // "esModuleInterop": false, 
    "forceConsistentCasingInFileNames": true,
    // "incremental": true, // This creates a series of .tsbuildinfo files in the same folder as your compilation output
    "isolatedModules": true,
    // "jsx": "preserve",
    "lib": ["ESNext"],
    "module": "ESNext",
    "moduleResolution": "node16", // 'node10' | 'node16' | 'bundler' 'classic'
    "noEmit": true,
    "paths": {
      "@/*": ["src/*"],
    },
    "resolveJsonModule": true,
    // "skipLibCheck": true,
    "strict": true,
    // "target": "ES6", // (If defined, overrides lib) || 'ES3' | 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ES2018' | 'ES2019' | 'ES2020' | 'ES2021' | 'ESNext'
  },
  "exclude": [
    "node_modules",
    "_ARCHIVE",
    ".DS_Store",

  ],
  "include": [
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx",
    "next.config.js",
    "next-env.d.ts",

  ],
  "resolutions": {
  //   "@types/react": "^18.0.0"
  },
}
