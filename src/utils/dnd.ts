import Engine from "../Engine";
import AbilityName, { AbilityNames } from "../types/AbilityName";
import ACMethod from "../types/ACMethod";
import Combatant from "../types/Combatant";
import Item from "../types/Item";
import SkillName from "../types/SkillName";
import { isA } from "./types";
import { distance } from "./units";

export function getAbilityModifier(ability: number) {
  return Math.floor((ability - 10) / 2);
}

export function getDiceAverage(count: number, size: number) {
  return ((size + 1) / 2) * count;
}

export function getProficiencyBonusByLevel(level: number) {
  return Math.ceil(level / 4) + 1;
}

export function getProficiencyType(thing: Item | AbilityName | SkillName) {
  if (typeof thing === "string") {
    if (isA(thing, AbilityNames))
      return { type: "ability" as const, ability: thing };
    return { type: "skill" as const, skill: thing };
  }

  if (thing.itemType === "weapon")
    return {
      type: "weapon" as const,
      category: thing.category,
      weapon: thing.weaponType,
    };

  if (thing.itemType === "armor")
    return { type: "armor" as const, category: thing.category };
}

export function getSaveDC(who: Combatant, ability: AbilityName) {
  return 8 + who.pb + who[ability].modifier;
}

export const getNaturalArmourMethod = (
  who: Combatant,
  naturalAC: number,
): ACMethod => {
  const uses = new Set<Item>();
  let ac = naturalAC + who.dex.modifier;

  if (who.shield) {
    uses.add(who.shield);
    ac += who.shield.ac;
  }

  return { name: "natural armor", ac, uses };
};

export function getFlanker(g: Engine, attacker: Combatant, target: Combatant) {
  for (const flanker of g.combatants.keys()) {
    if (flanker.side !== attacker.side) continue;
    if (flanker === attacker) continue;
    if (flanker.conditions.has("Incapacitated")) continue;
    if (distance(g, flanker, target) > 5) continue;

    return flanker;
  }
}
