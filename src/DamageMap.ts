import DamageType from "./types/DamageType";

export type DamageInitialiser = [type: DamageType, amount: number][];

export default class DamageMap {
  private map: Map<DamageType, number>;
  private _total: number;

  constructor(items: DamageInitialiser = []) {
    this.map = new Map(items);
    this._total = items.reduce((total, [, value]) => total + value, 0);
  }

  get total() {
    return this._total;
  }

  add(type: DamageType, value: number) {
    const old = this.map.get(type) ?? 0;
    this.map.set(type, old + value);
    this._total += value;
  }

  [Symbol.iterator]() {
    return this.map[Symbol.iterator]();
  }
}
