//-- https://prettier.io/docs/en/options.html
//-- https://github.com/tailwindlabs/prettier-plugin-tailwindcss
module.exports = {
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  jsxSingleQuote: true,


  //-- Override for Custom Files
  overrides: [

  ],

  //-- Plugins
  plugins: [require('prettier-plugin-tailwindcss')],
}