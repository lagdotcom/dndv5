/*eslint-env node*/

/** @type {import('@types/eslint').ESLint.Options['baseConfig']} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "jsx-a11y",
    "prettier",
    "promise",
    "react-hooks",
    "simple-import-sort",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "plugin:promise/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "crlf" }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
