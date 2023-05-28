const config = {
  importOrder: [
    "^~/components/(.*)$",
    "^next(.*)$",
    "^react(.*)$",
    "^~/(.*)$",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  semi: true,
  tabWidth: 2,
  printWidth: 72,
  trailingComma: "es5",
  singleQuote: false,
  jsxSingleQuote: false,
  arrowParens: "always",
  useTabs: false,
  endOfLine: "auto",
};

module.exports = config;
