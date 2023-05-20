import { DamageResponse } from "../types/DamageResponse";
import Source from "../types/Source";

export default class DamageResponseCollector {
  absorb: Set<Source>;
  immune: Set<Source>;
  resist: Set<Source>;
  normal: Set<Source>;
  vulnerable: Set<Source>;

  constructor() {
    this.absorb = new Set();
    this.immune = new Set();
    this.resist = new Set();
    this.normal = new Set();
    this.vulnerable = new Set();
  }

  add(response: DamageResponse, source: Source) {
    this[response].add(source);
  }

  get result(): DamageResponse {
    if (this.absorb.size) return "absorb";
    if (this.immune.size) return "immune";
    if (this.resist.size) return "resist";
    if (this.vulnerable.size) return "vulnerable";
    return "normal";
  }
}
