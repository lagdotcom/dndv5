import { MarkRequired } from "ts-essentials";

import DiceType from "./types/DiceType";
import RollType from "./types/RollType";

type MatchRollType = MarkRequired<Partial<RollType>, "type">;
type ForcedRoll = { value: number; matcher: MatchRollType };

function matches(rt: RollType, m: MatchRollType) {
  for (const [field, value] of Object.entries(m)) {
    if (rt[field as keyof MatchRollType] !== value) return false;
  }

  return true;
}

function sizeOfDice(rt: RollType) {
  switch (rt.type) {
    case "damage":
      return rt.size;

    case "bane":
    case "bless":
      return 4;

    default:
      return 20;
  }
}

export default class DiceBag {
  forcedRolls: Set<ForcedRoll>;
  constructor() {
    this.forcedRolls = new Set();
  }

  force(value: number, matcher: MatchRollType) {
    this.forcedRolls.add({ value, matcher });
  }

  getForcedRoll(rt: RollType) {
    for (const fr of this.forcedRolls) {
      if (matches(rt, fr.matcher)) {
        this.forcedRolls.delete(fr);
        return fr.value;
      }
    }
  }

  roll(rt: RollType, dt: DiceType = "normal") {
    const size = sizeOfDice(rt);
    let value = this.getForcedRoll(rt) ?? Math.ceil(Math.random() * size);
    const otherValues: number[] = [];

    if (dt !== "normal") {
      const second = this.getForcedRoll(rt) ?? Math.ceil(Math.random() * size);

      if (
        (dt === "advantage" && second > value) ||
        (dt === "disadvantage" && value > second)
      ) {
        otherValues.push(value);
        value = second;
      } else otherValues.push(second);
    }

    return { size, value, otherValues };
  }
}
