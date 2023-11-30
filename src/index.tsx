// import "preact/debug";

import App from "./ui/components/App";
import { render } from "./ui/lib";
import { FetchCache, SVGCacheContext } from "./ui/utils/SVGCache";

const svgCache = new FetchCache();
render(
  <SVGCacheContext.Provider value={svgCache}>
    <App />
  </SVGCacheContext.Provider>,
  document.body,
);
