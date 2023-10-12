/*eslint-env node*/

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "jest-preset-preact",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testEnvironment: "jsdom",
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    ".+\\.(png|svg)$": "jest-transform-stub",
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "@img/(.*)": "<rootDir>/src/img/$1",
  },
};
