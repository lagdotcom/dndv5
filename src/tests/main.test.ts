import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import Engine from "../Engine";
import Monster from "../Monster";
import PC from "../PC";

it("can run a simple battle", async () => {
  const user = userEvent.setup();
  const g = new Engine(document.body);
  const pc = new PC(g, "Tester", "Human", "");
  const mon = new Monster(g, "Badger", "beast", "tiny", "");
  g.place(pc, 0, 0);
  g.place(mon, 10, 0);
  g.dice.force(12, { type: "initiative", who: pc });
  g.dice.force(4, { type: "initiative", who: mon });

  await g.start();
  const east = screen.getByRole("button", { name: "East" });

  await user.click(east);
  const badger = screen.getByAltText("Badger");

  await user.click(badger);
  const attack = screen.getByRole("button", { name: "Unarmed Strike" });

  g.dice.force(19, { type: "attack", who: pc });
  await user.click(attack);

  expect(screen.queryByAltText("Badger")).not.toBeInTheDocument();
});
