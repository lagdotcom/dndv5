import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";

export function getAbilityModifier(ability: number) {
  return Math.floor((ability - 10) / 2);
}

export function getDiceAverage(count: number, size: number) {
  return ((size + 1) / 2) * count;
}

export function getProficiencyBonusByLevel(level: number) {
  return Math.ceil(level / 4) + 1;
}

export function getSaveDC(who: Combatant, ability: AbilityName) {
  return 8 + who.pb + who[ability].modifier;
}
