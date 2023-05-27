// import "preact/debug";

import { render } from "preact";

import Engine from "./Engine";
import Badger from "./monsters/Badger";
import Thug from "./monsters/Thug";
import Aura from "./pcs/davies/Aura";
import Beldalynn from "./pcs/davies/Beldalynn";
import Tethilssethanar from "./pcs/wizards/Tethilssethanar";
import App from "./ui/App";

const g = new Engine();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).g = g;
render(
  <App
    g={g}
    onMount={() => {
      const thug = new Thug(g);
      const badger = new Badger(g);
      const hunk = new Tethilssethanar(g);
      const aura = new Aura(g);
      const beldalynn = new Beldalynn(g);
      g.place(thug, 0, 0);
      g.place(badger, 10, 0);
      g.place(hunk, 10, 20);
      g.place(aura, 20, 20);
      g.place(beldalynn, 40, 20);
      g.start();
    }}
  />,
  document.body
);
