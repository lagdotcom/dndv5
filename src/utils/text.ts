import Ability from "../types/Ability";
import Point from "../types/Point";

const niceAbilityName: Record<Ability, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

export function describeAbility(ability: Ability) {
  return niceAbilityName[ability];
}

export function describeRange(min: number, max: number) {
  if (min === 0) {
    if (max === Infinity) return "any number of";
    return `up to ${max}`;
  }

  if (max === Infinity) return `${min}+`;

  if (min === max) return min.toString();

  return `${min}-${max}`;
}

export function describePoint(p?: Point) {
  return p ? `${p.x},${p.y}` : "NONE";
}
