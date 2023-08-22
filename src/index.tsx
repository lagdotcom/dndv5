// import "preact/debug";

import { render } from "preact";

import Engine from "./Engine";
import Birnotec from "./monsters/fiendishParty/Birnotec";
import Aura from "./pcs/davies/Aura";
import Beldalynn from "./pcs/davies/Beldalynn";
import Galilea from "./pcs/davies/Galilea";
import Hagrond from "./pcs/davies/Hagrond";
import Salgar from "./pcs/davies/Salgar";
import App from "./ui/App";
import { FetchCache, SVGCacheContext } from "./ui/utils/SVGCache";

const cache = new FetchCache();
const g = new Engine();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).g = g;
render(
  <SVGCacheContext.Provider value={cache}>
    <App
      g={g}
      onMount={() => {
        const aura = new Aura(g);
        const beldalynn = new Beldalynn(g);
        const galilea = new Galilea(g);
        const salgar = new Salgar(g);
        const hagrond = new Hagrond(g);
        const birnotec = new Birnotec(g);
        g.place(aura, 20, 20);
        g.place(beldalynn, 10, 30);
        g.place(galilea, 5, 0);
        g.place(salgar, 15, 30);
        g.place(hagrond, 0, 5);
        g.place(birnotec, 15, 0);
        g.start();
      }}
    />
  </SVGCacheContext.Provider>,
  document.body,
);
