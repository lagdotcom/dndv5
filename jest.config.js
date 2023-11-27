/*eslint-env node*/

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  collectCoverageFrom: ["src/**/*.{mjs,js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  moduleNameMapper: {
    "^react/jsx-runtime$": "preact/jsx-runtime",
    "^react-dom$": "preact/compat",
    "^react$": "preact/compat",
    "^.+\\.(css|sass|scss|less)$": "identity-obj-proxy",
    "^react-dom/test-utils$": "preact/test-utils",
    "@img/(.*)": "<rootDir>/src/img/$1",
  },
  transform: {
    ".+\\.(png|svg)$": "jest-transform-stub",
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(mjs|js|jsx|ts|tsx)$",
    "^.+\\.(css|sass|scss|less)$",
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  globals: { MODE: "test" },
};
