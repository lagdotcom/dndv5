import AbilityName, { AbilityNames } from "../types/AbilityName";
import Combatant from "../types/Combatant";
import Item from "../types/Item";
import SkillName from "../types/SkillName";
import { isA } from "./types";

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
