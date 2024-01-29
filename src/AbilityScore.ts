import { Score } from "./flavours";
import CombatantScore from "./types/CombatantScore";
import { getAbilityModifier } from "./utils/dnd";
import { clamp } from "./utils/numbers";

export default class AbilityScore implements CombatantScore {
  constructor(
    private baseScore: Score = 10,
    private baseMaximum: Score = 20,
    private baseMinimum: Score = 0,
  ) {}

  get score() {
    return clamp(this.baseScore, this.baseMinimum, this.baseMaximum);
  }

  set score(value: Score) {
    this.baseScore = value;
  }

  get maximum() {
    return this.baseMaximum;
  }

  set maximum(value: Score) {
    this.baseMaximum = Math.max(this.baseMaximum, value);
  }

  get minimum() {
    return this.baseMinimum;
  }

  set minimum(value: Score) {
    this.baseMinimum = Math.max(this.baseMinimum, value);
  }

  get modifier() {
    return getAbilityModifier(this.score);
  }
}
