import Engine from "../Engine";
import { DiceRoll, Feet, Pixels, SideID, Url } from "../flavours";
import { AlignmentPair } from "../types/Alignment";
import Empty from "../types/Empty";
import Item from "../types/Item";
import Point from "../types/Point";
import allMonsters, { MonsterName } from "./allMonsters";
import allPCs, { PCName } from "./allPCs";
import initialiseMonster from "./initialiseMonster";
import initialisePC from "./initialisePC";
import MonsterTemplate from "./MonsterTemplate";

export type ItemCreator = (g: Engine) => Item;

interface EntryBase {
  side?: SideID;
  x: Feet;
  y: Feet;
  initiative?: DiceRoll;
  alignment?: AlignmentPair;
}

export interface PCEntry extends EntryBase {
  type: "pc";
  name: PCName;
  config?: never;
}
export interface MonsterEntry<T extends object = Empty> extends EntryBase {
  type: "monster";
  name: MonsterName;
  config?: T;
}

export type BattleTemplateEntry = PCEntry | MonsterEntry;

export interface BattleTemplateImage extends Point {
  src: Url;
  zIndex?: number;
  width?: Pixels;
  height?: Pixels;
}

interface BattleTemplate {
  combatants: BattleTemplateEntry[];
  images?: BattleTemplateImage[];
}
export default BattleTemplate;

export function initialiseFromTemplate(
  g: Engine,
  { combatants }: BattleTemplate,
) {
  for (const {
    type,
    name,
    side,
    x,
    y,
    initiative,
    alignment,
    config,
  } of combatants) {
    const who =
      type === "pc"
        ? initialisePC(g, allPCs[name])
        : initialiseMonster(
            g,
            allMonsters[name] as MonsterTemplate<unknown>,
            config,
          );
    if (typeof side === "number") who.side = side;
    g.place(who, x, y);

    if (typeof initiative === "number") {
      g.dice.force(initiative, { type: "initiative", who });
      g.dice.force(initiative, { type: "initiative", who });
    }

    if (alignment) {
      const [lc, ge] = alignment;
      who.alignLC = lc;
      who.alignGE = ge;
    }
  }
  return g.start();
}
