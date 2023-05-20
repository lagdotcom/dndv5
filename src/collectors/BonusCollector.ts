import Source from "../types/Source";

type Bonus = { value: number; source: Source };

export default class BonusCollector {
  effects: Set<Bonus>;

  constructor() {
    this.effects = new Set();
  }

  add(value: number, source: Source) {
    this.effects.add({ value, source });
  }

  get result() {
    let total = 0;
    for (const { value } of this.effects) total += value;
    return total;
  }
}
