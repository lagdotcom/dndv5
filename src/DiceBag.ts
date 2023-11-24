import { MarkRequired } from "ts-essentials";

import ValueCollector from "./collectors/ValueCollector";
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
    case "heal":
    case "other":
      return rt.size;

    case "bane":
    case "bless":
      return 4;

    case "attack":
    case "check":
    case "initiative":
    case "luck":
    case "save":
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
    const value = this.getForcedRoll(rt) ?? Math.ceil(Math.random() * size);
    const values = new ValueCollector(value);

    if (dt !== "normal") {
      const second = this.getForcedRoll(rt) ?? Math.ceil(Math.random() * size);
      const prefer = dt === "advantage" ? "higher" : "lower";
      values.add(second, prefer);
    }

    return { size, values };
  }
}
