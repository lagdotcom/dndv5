import { render } from "preact";

import Engine from "./Engine";
import Badger from "./monsters/Badger";
import Thug from "./monsters/Thug";
import Tethilssethanar from "./pcs/wizards/Tethilssethanar";
import App from "./ui/App";

const g = new Engine();
(window as any).g = g;
render(
  <App
    g={g}
    onMount={() => {
      const thug = new Thug(g);
      const badger = new Badger(g);
      const teth = new Tethilssethanar(g);
      g.place(thug, 0, 0);
      g.place(badger, 10, 0);
      g.place(teth, 10, 20);
      g.start();
    }}
  />,
  document.body
);
