// import "preact/debug";

import { render } from "preact";

import Engine from "./Engine";
import Birnotec from "./monsters/fiendishParty/Birnotec";
import Kay from "./monsters/fiendishParty/Kay";
import OGonrit from "./monsters/fiendishParty/OGonrit";
import Yulash from "./monsters/fiendishParty/Yulash";
import Zafron from "./monsters/fiendishParty/Zafron";
import Aura from "./pcs/davies/Aura";
import Beldalynn from "./pcs/davies/Beldalynn";
import Galilea from "./pcs/davies/Galilea";
import Hagrond from "./pcs/davies/Hagrond";
import Salgar from "./pcs/davies/Salgar";
import App from "./ui/App";
import { FetchCache, SVGCacheContext } from "./ui/utils/SVGCache";

const svgCache = new FetchCache();
const gInstance = new Engine();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).g = gInstance;
render(
  <SVGCacheContext.Provider value={svgCache}>
    <App
      g={gInstance}
      onMount={() => {
        const aura = new Aura(gInstance);
        const beldalynn = new Beldalynn(gInstance);
        const galilea = new Galilea(gInstance);
        const salgar = new Salgar(gInstance);
        const hagrond = new Hagrond(gInstance);
        const birnotec = new Birnotec(gInstance);
        const kay = new Kay(gInstance);
        const gonrit = new OGonrit(gInstance);
        const yulash = new Yulash(gInstance);
        const zafron = new Zafron(gInstance);
        gInstance.place(aura, 20, 20);
        gInstance.place(beldalynn, 10, 30);
        gInstance.place(galilea, 5, 0);
        gInstance.place(salgar, 15, 30);
        gInstance.place(hagrond, 0, 5);
        gInstance.place(birnotec, 15, 0);
        gInstance.place(kay, 20, 0);
        gInstance.place(gonrit, 10, 15);
        gInstance.place(yulash, 25, 10);
        gInstance.place(zafron, 10, 5);
        gInstance.start();
      }}
    />
  </SVGCacheContext.Provider>,
  document.body,
);
