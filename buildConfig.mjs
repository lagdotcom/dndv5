/*eslint-env node*/

import { postcssModules, sassPlugin } from "esbuild-sass-plugin";

import CDNModule from "./CDNModule.mjs";

/**
 * @param {string} mode
 * @param {import('esbuild').BuildOptions} [options={}] custom options
 * @returns {import('esbuild').BuildOptions} combined options
 */
export default function getBuildConfig(mode, options = {}) {
  return {
    entryPoints: ["src/index.tsx"],
    bundle: true,
    outfile: "docs/bundle.js",
    target: "es2018",
    define: {
      MODE: JSON.stringify(mode),
      [`process.env.APP_BUILD_VERSION`]: JSON.stringify(
        process.env.npm_package_version
      ),
    },
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
    alias: { "@img": "./src/img" },
    ...options,
  };
}
