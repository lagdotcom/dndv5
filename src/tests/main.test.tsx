import { render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import Engine from "../Engine";
import BeforeAttackEvent from "../events/BeforeAttackEvent";
import Badger from "../monsters/Badger";
import Thug from "../monsters/Thug";
import Tethilssethanar from "../pcs/wizards/Tethilssethanar";
import App from "../ui/App";

const btn = (name: string) => screen.getByRole("button", { name });
const token = (name: string) => screen.getByAltText(name);

afterEach(() => {
  document.body.innerHTML = "";
});

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
  await user.click(btn("East"));
  await user.click(token("badger"));

  g.dice.force(19, { type: "attack", who: me });
  await user.click(btn("mace"));

  expect(screen.queryByAltText("badger")).not.toBeInTheDocument();
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

  await g.start();
  await user.click(btn("Fog Cloud"));
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
