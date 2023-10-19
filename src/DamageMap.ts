import DamageType from "./types/DamageType";
import { MapInitialiser } from "./utils/map";

// for simplicity's sake
export type DamageInitialiser = [DamageType, number][];

export default class DamageMap extends Map<DamageType, number> {
  constructor(items: MapInitialiser<DamageType, number> = []) {
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
