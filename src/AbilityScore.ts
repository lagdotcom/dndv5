import CombatantScore from "./types/CombatantScore";
import { getAbilityModifier } from "./utils/dnd";

export default class AbilityScore implements CombatantScore {
  constructor(private baseScore = 10, private baseMaximum = 20) {}

  get score() {
    return Math.min(this.baseScore, this.maximum);
  }

  set score(value: number) {
    this.baseScore = value;
  }

  get maximum() {
    return this.baseMaximum;
  }

  set maximum(value: number) {
    this.baseMaximum = value;
  }

  get modifier() {
    return getAbilityModifier(this.score);
  }

  setMaximum(value: number): void {
    this.baseMaximum = Math.max(this.baseMaximum, value);
  }

  setScore(value: number) {
    this.baseScore = value;
  }
}
