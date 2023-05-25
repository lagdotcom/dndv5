import {
  getByAltText,
  getByRole,
  queryByRole,
  render,
  screen,
  waitFor,
} from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import Engine from "../Engine";
import Badger from "../monsters/Badger";
import Thug from "../monsters/Thug";
import Aura from "../pcs/davies/Aura";
import Tethilssethanar from "../pcs/wizards/Tethilssethanar";
import App from "../ui/App";

const dialog = (name?: string) => screen.getByRole("dialog", { name });
const main = () => screen.getByRole("main");
const log = () => screen.getByRole("list", { name: "Event Log" });

const btn = (name: string) => screen.getByRole("button", { name });
const choice = (name: string) => getByRole(dialog(), "button", { name });
const menuitem = (name: string) => screen.getByRole("menuitem", { name });
const token = (name: string) => getByAltText(main(), name);
const logMsg = (want: string) => getByRole(log(), "listitem", { name: want });

const queryToken = (name: string) => queryByRole(main(), name);

it("can run a simple battle", async () => {
  const user = userEvent.setup();
  const g = new Engine();
  render(<App g={g} />);

  const me = new Thug(g);
  const them = new Badger(g);
  g.place(me, 0, 0);
  g.place(them, 10, 0);
  g.dice.force(12, { type: "initiative", who: me });
  g.dice.force(4, { type: "initiative", who: them });

  await g.start();
  await user.click(btn("Move East"));
  await user.click(token("badger"));

  g.dice.force(19, { type: "attack", who: me });
  await user.click(menuitem("mace"));

  expect(queryToken("badger")).not.toBeInTheDocument();
  expect(logMsg("badger dies!")).toBeVisible();
});

it("supports Fog Cloud", async () => {
  const user = userEvent.setup();
  const g = new Engine();
  render(<App g={g} />);

  const pc = new Tethilssethanar(g);
  const enemy = new Thug(g);
  g.place(pc, 0, 0);
  g.place(enemy, 30, 0);
  g.dice.force(20, { type: "initiative", who: pc });
  g.dice.force(10, { type: "initiative", who: enemy });

  const getFogCloud = () => btn("Fog Cloud (Control Air and Water)");

  await g.start();
  await waitFor(getFogCloud);
  await user.click(getFogCloud());
  await user.click(btn("Choose Point"));
  await user.click(token("thug"));
  await user.click(btn("Execute"));
  expect(logMsg("Tethilssethanar casts Fog Cloud at level 1.")).toBeVisible();
  await user.click(btn("End Turn"));

  // area counts as heavily obscured, so attack has disadvantage from being blinded
  await user.click(token("Tethilssethanar"));
  g.dice.force(19, { type: "attack", who: enemy });
  g.dice.force(5, { type: "attack", who: enemy });
  await user.click(menuitem("heavy crossbow (crossbow bolt)"));
  expect(
    logMsg(
      "thug attacks Tethilssethanar at disadvantage with heavy crossbow, firing crossbow bolt (7)."
    )
  );
  await user.click(btn("End Turn"));

  // attacking into a heavily obscured area also counts as being blinded, so they cancel out
  await user.click(token("thug"));
  g.dice.force(5, { type: "attack", who: pc });
  await user.click(menuitem("dart"));
  expect(logMsg("Tethilssethanar attacks thug with dart (9)."));
});

it("supports a typical Aura attack", async () => {
  const user = userEvent.setup();
  const g = new Engine();
  render(<App g={g} />);

  const aura = new Aura(g);
  const ally = new Tethilssethanar(g);
  const enemy = new Thug(g);
  g.place(enemy, 0, 0);
  g.place(ally, 5, 0);
  g.place(aura, 10, 10);
  g.dice.force(20, { type: "initiative", who: aura });
  g.dice.force(2, { type: "initiative", who: ally });
  g.dice.force(1, { type: "initiative", who: enemy });

  await g.start();
  await user.click(token("thug"));
  g.dice.force(1, { type: "attack", who: aura });
  await user.click(menuitem("vicious light crossbow (crossbow bolt)"));

  expect(dialog("Lucky")).toBeVisible();
  g.dice.force(20, { type: "luck", who: aura });
  // 2d8 for crossbow base damage
  for (let i = 0; i < 2; i++)
    g.dice.force(1, { type: "damage", attacker: aura });
  // 8d6 for sneak attack damage
  for (let i = 0; i < 8; i++)
    g.dice.force(1, { type: "damage", attacker: aura });
  await user.click(choice("Yes"));

  expect(dialog("Sneak Attack")).toBeVisible();
  await user.click(choice("Yes"));
  expect(logMsg("thug takes 22 damage. (22 piercing)")).toBeVisible();
});
