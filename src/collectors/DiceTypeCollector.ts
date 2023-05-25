import DiceType from "../types/DiceType";
import Source from "../types/Source";

export default class DiceTypeCollector {
  advantage: Set<Source>;
  disadvantage: Set<Source>;
  normal: Set<Source>;
  sources: Set<Source>;

  constructor() {
    this.advantage = new Set();
    this.disadvantage = new Set();
    this.normal = new Set();
    this.sources = new Set();
  }

  add(response: DiceType, source: Source) {
    this[response].add(source);
    this.sources.add(source);
  }

  involved(source: Source) {
    return this.sources.has(source);
  }

  get result(): DiceType {
    const hasAdvantage = this.advantage.size > 0;
    const hasDisadvantage = this.disadvantage.size > 0;

    if (hasAdvantage === hasDisadvantage) return "normal";
    return hasAdvantage ? "advantage" : "disadvantage";
  }
}
