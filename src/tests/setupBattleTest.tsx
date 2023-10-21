import { render } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import Engine from "../Engine";
import Combatant from "../types/Combatant";
import App from "../ui/App";
import { SVGCacheContext } from "../ui/utils/SVGCache";

export type BattleEntry = [
  constructor: new (g: Engine) => Combatant,
  x: number,
  y: number,
  initiative: number,
];

export const MockSVGCache = {
  async get() {
    return "";
  },
};

export default async function setupBattleTest(...entries: BattleEntry[]) {
  const user = userEvent.setup();
  const g = new Engine();
  render(
    <SVGCacheContext.Provider value={MockSVGCache}>
      <App g={g} />
    </SVGCacheContext.Provider>,
  );

  const combatants = entries.map(([constructor, x, y, initiative]) => {
    const z = new constructor(g);
    g.place(z, x, y);
    g.dice.force(initiative, { type: "initiative", who: z });
    g.dice.force(initiative, { type: "initiative", who: z }); // in case they have adv/dis
    return z;
  });

  await g.start();
  return { g, user, combatants };
}
