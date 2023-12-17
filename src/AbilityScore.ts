import CombatantScore from "./types/CombatantScore";
import { getAbilityModifier } from "./utils/dnd";

export default class AbilityScore implements CombatantScore {
  constructor(
    private baseScore = 10,
    private baseMaximum = 20,
    private baseMinimum = 0,
  ) {}

  get score() {
    return Math.max(this.baseMinimum, Math.min(this.baseScore, this.maximum));
  }

  set score(value: number) {
    this.baseScore = value;
  }

  get maximum() {
    return this.baseMaximum;
  }

  set maximum(value: number) {
    this.baseMaximum = Math.max(this.baseMaximum, value);
  }

  get minimum() {
    return this.baseMinimum;
  }

  set minimum(value: number) {
    this.baseMinimum = Math.max(this.baseMinimum, value);
  }

  get modifier() {
    return getAbilityModifier(this.score);
  }
}
