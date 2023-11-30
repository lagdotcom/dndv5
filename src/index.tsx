// import "preact/debug";

import { render } from "preact";

import App from "./ui/components/App";
import { FetchCache, SVGCacheContext } from "./ui/utils/SVGCache";

const svgCache = new FetchCache();
render(
  <SVGCacheContext.Provider value={svgCache}>
    <App />
  </SVGCacheContext.Provider>,
  document.body,
);
