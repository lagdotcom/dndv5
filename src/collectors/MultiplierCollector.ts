import Source from "../types/Source";

interface Multiplier {
  value: number;
  source: Source;
}

export default class MultiplierCollector {
  multipliers: Set<Multiplier>;

  constructor() {
    this.multipliers = new Set();
  }

  add(value: number, source: Source) {
    this.multipliers.add({ value, source });
  }

  get value() {
    let total = 1;
    for (const { value } of this.multipliers) total *= value;
    return total;
  }
}
