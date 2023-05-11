/** @type {import('@types/eslint').ESLint.Options['baseConfig']} */
// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "jsx-a11y",
    "prettier",
    "promise",
    "simple-import-sort",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:promise/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "crlf" }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
