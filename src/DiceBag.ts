import { MarkRequired } from "ts-essentials";

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

  roll(rt: RollType) {
    const size = sizeOfDice(rt);

    for (const fr of this.forcedRolls) {
      if (matches(rt, fr.matcher)) {
        this.forcedRolls.delete(fr);
        return { size, value: fr.value };
      }
    }

    const value = Math.ceil(Math.random() * size);
    return { size, value };
  }
}
