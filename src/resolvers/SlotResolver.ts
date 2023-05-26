import CastSpell from "../actions/CastSpell";
import ErrorCollector from "../collectors/ErrorCollector";
import Action, { Resolver } from "../types/Action";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class SlotResolver implements Resolver<number> {
  type: "SpellSlot";

  constructor(public spell: Spell, public method: SpellcastingMethod) {
    this.type = "SpellSlot";
  }

  get minimum() {
    return this.method.getMinSlot(this.spell);
  }

  get maximum() {
    return this.method.getMaxSlot(this.spell);
  }

  get name() {
    if (this.minimum === this.maximum) return `spell slot (${this.minimum})`;
    return `spell slot (${this.minimum}-${this.maximum})`;
  }

  check(value: unknown, action: Action, ec = new ErrorCollector()) {
    if (action instanceof CastSpell) this.method = action.method;

    if (typeof value !== "number") ec.add("No spell level chosen", this);
    else {
      if (value < this.minimum) ec.add("Too low", this);
      if (value > this.maximum) ec.add("Too high", this);

      // TODO check against action.method.max or whatever
    }

    return ec;
  }
}
