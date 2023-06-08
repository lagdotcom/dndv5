/*eslint-env node*/

import { postcssModules, sassPlugin } from "esbuild-sass-plugin";

import CDNModule from "./CDNModule.mjs";

const define = {
  [`process.env.APP_BUILD_VERSION`]: JSON.stringify(
    process.env.npm_package_version
  ),
};

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  sourcemap: true,
  outfile: "docs/bundle.js",
  define,
  // minify: true,
  plugins: [
    CDNModule,
    sassPlugin({
      filter: /\.module\.scss$/,
      transform: postcssModules({ basedir: "./src" }),
    }),
  ],
  loader: {
    ".json": "file",
    ".ogg": "file",
    ".png": "file",
    ".svg": "file",
  },
};
export default config;
