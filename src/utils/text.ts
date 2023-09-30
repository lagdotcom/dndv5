import AbilityName from "../types/AbilityName";
import Amount from "../types/Amount";
import Point from "../types/Point";
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
