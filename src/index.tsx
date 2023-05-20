import { render } from "preact";

import Engine from "./Engine";
import Badger from "./monsters/Badger";
import Thug from "./monsters/Thug";
import App from "./ui/App";

const g = new Engine();
(window as any).g = g;
render(
  <App
    g={g}
    onMount={() => {
      const thug = new Thug(g);
      const badger = new Badger(g);
      g.place(thug, 0, 0);
      g.place(badger, 10, 0);
      g.start();
    }}
  />,
  document.body
);
