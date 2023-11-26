import Engine from "../Engine";
import { AbilityNames } from "../types/AbilityName";
import ACMethod from "../types/ACMethod";
import Combatant from "../types/Combatant";
import HasProficiency from "../types/HasProficiency";
import Item, { ArmorCategories, WeaponCategories } from "../types/Item";
import ProficiencyType, { ProficiencyTypes } from "../types/ProficiencyType";
import { SkillNames } from "../types/SkillName";
import { ToolNames } from "../types/ToolName";
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

export function getProficiencyType(thing: HasProficiency) {
  if (typeof thing === "string") {
    if (isA(thing, AbilityNames))
      return { type: "ability", ability: thing } as const;

    if (isA(thing, ArmorCategories))
      return { type: "armor", category: thing } as const;

    if (isA(thing, WeaponCategories))
      return { type: "weaponCategory", category: thing } as const;

    if (isA(thing, ToolNames)) return { type: "tool", tool: thing } as const;

    if (isA(thing, SkillNames)) return { type: "skill", skill: thing } as const;

    throw new Error(`${thing} has no proficiency`);
  }

  if (thing.itemType === "weapon")
    return {
      type: "weapon",
      category: thing.category,
      weapon: thing.weaponType,
    } as const;

  if (thing.itemType === "armor")
    return { type: "armor", category: thing.category } as const;
}

export function getProficiencyMax(...types: ProficiencyType[]) {
  return types.sort(
    (a, b) => ProficiencyTypes.indexOf(b) - ProficiencyTypes.indexOf(a),
  )[0];
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
    if (distance(flanker, target) > 5) continue;

    return flanker;
  }
}
