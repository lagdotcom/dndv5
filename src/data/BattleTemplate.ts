import Engine from "../Engine";
import Combatant from "../types/Combatant";
import Item from "../types/Item";
import allMonsters, { MonsterName } from "./allMonsters";
import allPCs, { PCName } from "./allPCs";
import initialisePC from "./initialisePC";

export type CombatantCreator = (g: Engine) => Combatant;
export type ItemCreator = (g: Engine, quantity?: number) => Item;

interface PCEntry {
  type: "pc";
  name: PCName;
}
interface MonsterEntry {
  type: "monster";
  name: MonsterName;
}

export type BattleTemplateEntry = (PCEntry | MonsterEntry) & {
  side?: number;
  x: number;
  y: number;
  initiative?: number;
};

interface BattleTemplate {
  combatants: BattleTemplateEntry[];
}
export default BattleTemplate;

export function initialiseFromTemplate(
  g: Engine,
  { combatants }: BattleTemplate,
) {
  for (const { type, name, side, x, y, initiative } of combatants) {
    const who =
      type === "pc" ? initialisePC(g, allPCs[name]) : allMonsters[name](g);
    if (typeof side === "number") who.side = side;
    g.place(who, x, y);

    if (typeof initiative === "number") {
      g.dice.force(initiative, { type: "initiative", who });
      g.dice.force(initiative, { type: "initiative", who });
    }
  }
  return g.start();
}
