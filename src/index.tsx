// import "preact/debug";

import { render } from "preact";

import { daviesVsFiends, useTemplate } from "./data/templates";
import Engine from "./Engine";
import App from "./ui/App";
import { FetchCache, SVGCacheContext } from "./ui/utils/SVGCache";

const template = daviesVsFiends;
const svgCache = new FetchCache();
const gInstance = new Engine();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).g = gInstance;
render(
  <SVGCacheContext.Provider value={svgCache}>
    <App g={gInstance} onMount={() => useTemplate(gInstance, template)} />
  </SVGCacheContext.Provider>,
  document.body,
);
