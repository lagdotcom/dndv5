import { render } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import BattleTemplate, { initialiseFromTemplate } from "../data/BattleTemplate";
import Engine from "../Engine";
import CombatUI from "../ui/components/CombatUI";
import { SVGCacheContext } from "../ui/utils/SVGCache";

export const MockSVGCache = {
  async get() {
    return "";
  },
};

export async function setupBattleTestWithReact(template: BattleTemplate) {
  const user = userEvent.setup();
  const g = new Engine();
  const result = render(
    <SVGCacheContext.Provider value={MockSVGCache}>
      <CombatUI g={g} />
    </SVGCacheContext.Provider>,
  );

  await initialiseFromTemplate(g, template);
  const combatants = Array.from(g.combatants);

  return { ...result, g, user, combatants };
}

export default async function setupBattleTest(template: BattleTemplate) {
  const g = new Engine();

  await initialiseFromTemplate(g, template);
  const combatants = Array.from(g.combatants);

  return { g, combatants };
}
