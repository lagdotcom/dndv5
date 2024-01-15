import AbilityName from "../types/AbilityName";
import Amount from "../types/Amount";
import Point from "../types/Point";
import SaveTag from "../types/SaveTag";
import SkillName from "../types/SkillName";
import { getDiceAverage } from "./dnd";

const niceAbilityName: Record<AbilityName, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

export function describeAbility(ability: AbilityName) {
  return niceAbilityName[ability];
}

export function describeCheck(ability: AbilityName, skill?: SkillName) {
  if (skill) return `${describeAbility(ability)} (${skill})`;
  return describeAbility(ability);
}

export function describeSave(tags: Set<SaveTag>, ability?: AbilityName) {
  if (tags.has("death")) return "death";
  if (ability) return describeAbility(ability);
}

export function describeRange<T extends number>(min: T, max: T) {
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

export function describeDice(amounts: Amount[]) {
  let average = 0;
  let flat = 0;
  const dice = [];

  for (const a of amounts) {
    if (a.type === "flat") {
      average += a.amount;
      flat += a.amount;
    } else {
      const { count, size } = a.amount;
      average += getDiceAverage(count, size);
      dice.push(`${count}d${size}`);
    }
  }

  let list = dice.join(" + ");
  if (flat < 0) list += ` - ${-flat}`;
  else if (flat > 0) list += ` + ${flat}`;

  return { average, list };
}
