/*eslint-env node*/

/** @type {import('@types/eslint').ESLint.Options['baseConfig']} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  settings: {
    react: { pragma: "h", version: "16.0" },
  },
  plugins: [
    "@typescript-eslint",
    "jest",
    "jest-dom",
    "jsx-a11y",
    "prettier",
    "promise",
    "react",
    "react-hooks",
    "simple-import-sort",
    "sonarjs",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/stylistic",
    "plugin:jest/recommended",
    "plugin:jest-dom/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "plugin:promise/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:sonarjs/recommended",
  ],
  rules: {
    "arrow-body-style": ["error", "as-needed"],
    "no-duplicate-imports": ["error"],
    "object-shorthand": ["error", "always"],
    "prettier/prettier": ["error", { endOfLine: "crlf" }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sonarjs/no-duplicate-string": ["off"],
  },

  overrides: [
    {
      files: "*.test.ts",
      rules: { "@typescript-eslint/no-non-null-assertion": "off" },
    },
  ],
};
