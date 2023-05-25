/*eslint-env node*/

const externals = {
  preact: "preact",
  "preact/hooks": "preactHooks",
  "@preact/signals-core": "preactSignalsCore",
  "@preact/signals": "preactSignals",
};

const filter = new RegExp(
  Object.keys(externals)
    .map((module) => `^${module}$`)
    .join("|")
);

const module = {
  name: "CDN",
  setup(build) {
    build.onResolve({ filter, namespace: "file" }, (args) => {
      return {
        path: args.path,
        namespace: "globalExternal",
      };
    });
    build.onLoad({ filter: /.*/, namespace: "globalExternal" }, (args) => {
      const glob = externals[args.path];
      const exports =
        typeof glob === "function" ? glob() : `globalThis.${glob}`;

      console.log("injected", args.path);
      return {
        contents: `module.exports = ${exports}`,
        loader: "js",
      };
    });
  },
};
export default module;
