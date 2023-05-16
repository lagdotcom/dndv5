import Engine from "./Engine";
import Monster from "./Monster";
import PC from "./PC";

window.addEventListener("load", () => {
  const g = new Engine(document.body);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).g = g;

  const pc = new PC(g, "Tester", "Human", "https://5e.tools/img/MM/Thug.png");
  const mon = new Monster(
    g,
    "Badger",
    "beast",
    "tiny",
    "https://5e.tools/img/MM/Badger.png"
  );
  g.place(pc, 0, 0);
  g.place(mon, 10, 0);
});
