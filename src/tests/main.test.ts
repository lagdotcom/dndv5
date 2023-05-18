import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import Engine from "../Engine";
import Badger from "../monsters/Badger";
import Thug from "../monsters/Thug";

it("can run a simple battle", async () => {
  const user = userEvent.setup();
  const g = new Engine(document.body);
  const me = new Thug(g);
  const them = new Badger(g);
  g.place(me, 0, 0);
  g.place(them, 10, 0);
  g.dice.force(12, { type: "initiative", who: me });
  g.dice.force(4, { type: "initiative", who: them });

  await g.start();
  const east = screen.getByRole("button", { name: "East" });

  await user.click(east);
  const badger = screen.getByAltText("badger");

  await user.click(badger);
  const attack = screen.getByRole("button", { name: "mace" });

  g.dice.force(19, { type: "attack", who: me });
  await user.click(attack);

  expect(screen.queryByAltText("badger")).not.toBeInTheDocument();
});
