import { MarkRequired } from "ts-essentials";

import { DiceType } from "./types/DiceType";
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

  roll(rt: RollType, dt: DiceType) {
    // TODO advantage etc.

    const size = sizeOfDice(rt);
    const value = this.getForcedRoll(rt) ?? Math.ceil(Math.random() * size);
    return { size, value };
  }
}
