import DamageType from "./types/DamageType";

export type DamageInitialiser = [type: DamageType, amount: number][];

export default class DamageMap extends Map<DamageType, number> {
  constructor(items: DamageInitialiser = []) {
    super(items);
  }

  get total() {
    let total = 0;
    for (const amount of this.values()) total += amount;
    return total;
  }

  add(type: DamageType, value: number) {
    const old = this.get(type) ?? 0;
    this.set(type, old + value);
  }
}
