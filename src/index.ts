import Engine from "./Engine";
import Badger from "./monsters/Badger";
import Thug from "./monsters/Thug";

window.addEventListener("load", () => {
  const g = new Engine(document.body);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).g = g;

  const thug = new Thug(g);
  const badger = new Badger(g);
  g.place(thug, 0, 0);
  g.place(badger, 10, 0);
});
