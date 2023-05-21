import {
  getByAltText,
  getByText,
  queryByRole,
  render,
  screen,
  waitFor,
} from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import Engine from "../Engine";
import BeforeAttackEvent from "../events/BeforeAttackEvent";
import Badger from "../monsters/Badger";
import Thug from "../monsters/Thug";
import Tethilssethanar from "../pcs/wizards/Tethilssethanar";
import App from "../ui/App";

const main = () => screen.getByRole("main");
const log = () => screen.getByRole("list", { name: "Event Log" });

const btn = (name: string) => screen.getByRole("button", { name });
const menuitem = (name: string) => screen.getByRole("menuitem", { name });
const token = (name: string) => getByAltText(main(), name);
const logMsg = (want: string) =>
  getByText(log(), (_, el) => {
    if (!(el instanceof HTMLLIElement)) return false;

    const text: string[] = [];
    for (const e of el.childNodes) {
      if (e.textContent) text.push(e.textContent);
    }
    return text.join(" ") === want;
  });

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
  expect(logMsg("badger dies!")).toBeInTheDocument();
});

it("supports Fog Cloud", async () => {
  const user = userEvent.setup();
  const g = new Engine();
  render(<App g={g} />);

  const pc = new Tethilssethanar(g);
  const enemy = new Thug(g);
  g.place(pc, 0, 0);
  g.place(enemy, 80, 0);
  g.dice.force(20, { type: "initiative", who: pc });
  g.dice.force(10, { type: "initiative", who: enemy });

  const getFogCloud = () => btn("Fog Cloud (Control Air and Water)");

  await g.start();
  await waitFor(getFogCloud);
  await user.click(getFogCloud());
  await user.click(btn("Choose Point"));
  await user.click(screen.getByText("5,0"));
  await user.click(btn("End Turn"));

  await user.click(token("Tethilssethanar"));

  const onBeforeAttack = jest.fn<void, [BeforeAttackEvent]>();
  g.events.on("beforeAttack", onBeforeAttack);
  await user.click(btn("heavy crossbow"));

  // TODO find a way to check this in the frontend
  expect(onBeforeAttack).toHaveBeenCalled();
  const [e] = onBeforeAttack.mock.calls[0];
  expect(e.detail.diceType.result).toBe("disadvantage");
});
