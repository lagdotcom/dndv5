// import "preact/debug";

import { render } from "preact";

import Engine from "./Engine";
import Badger from "./monsters/Badger";
import Thug from "./monsters/Thug";
import Aura from "./pcs/davies/Aura";
import Beldalynn from "./pcs/davies/Beldalynn";
import Galilea from "./pcs/davies/Galilea";
import Hagrond from "./pcs/davies/Hagrond";
import Salgar from "./pcs/davies/Salgar";
import Tethilssethanar from "./pcs/wizards/Tethilssethanar";
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
        const thug = new Thug(g);
        const badger = new Badger(g);
        const hunk = new Tethilssethanar(g);
        const aura = new Aura(g);
        const beldalynn = new Beldalynn(g);
        const galilea = new Galilea(g);
        const salgar = new Salgar(g);
        const hagrond = new Hagrond(g);
        g.place(thug, 0, 0);
        g.place(badger, 10, 0);
        g.place(hunk, 10, 5);
        g.place(aura, 20, 20);
        g.place(beldalynn, 10, 30);
        g.place(galilea, 5, 0);
        g.place(salgar, 15, 30);
        g.place(hagrond, 0, 5);
        g.start();
      }}
    />
  </SVGCacheContext.Provider>,
  document.body
);
