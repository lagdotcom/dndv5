import { render } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import { MonsterName } from "../data/allMonsters";
import allPCs, { PCName } from "../data/allPCs";
import BattleTemplate, { initialiseFromTemplate } from "../data/BattleTemplate";
import Engine from "../Engine";
import CombatUI from "../ui/components/CombatUI";
import { SVGCacheContext } from "../ui/utils/SVGCache";

export type BattleEntry = [
  name: PCName | MonsterName,
  x: number,
  y: number,
  initiative: number,
];

export const MockSVGCache = {
  async get() {
    return "";
  },
};

function nameAsTemplate(name: PCName | MonsterName) {
  if (allPCs[name as PCName])
    return { type: "pc", name: name as PCName } as const;
  return { type: "monster", name: name as MonsterName } as const;
}

export async function setupBattleTestWithReact(...entries: BattleEntry[]) {
  const user = userEvent.setup();
  const g = new Engine();
  const result = render(
    <SVGCacheContext.Provider value={MockSVGCache}>
      <CombatUI g={g} />
    </SVGCacheContext.Provider>,
  );

  const template: BattleTemplate = {
    combatants: entries.map(([name, x, y, initiative]) => ({
      ...nameAsTemplate(name),
      x,
      y,
      initiative,
    })),
  };

  await initialiseFromTemplate(g, template);
  const combatants = Array.from(g.combatants);

  return { ...result, g, user, combatants };
}

export default async function setupBattleTest(...entries: BattleEntry[]) {
  const g = new Engine();

  const template: BattleTemplate = {
    combatants: entries.map(([name, x, y, initiative]) => ({
      ...nameAsTemplate(name),
      x,
      y,
      initiative,
    })),
  };

  await initialiseFromTemplate(g, template);
  const combatants = Array.from(g.combatants);

  return { g, combatants };
}
