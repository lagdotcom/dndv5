import ErrorCollector from "../collectors/ErrorCollector";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import Resolver from "../types/Resolver";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class SlotResolver implements Resolver<number> {
  name: string;
  type: "SpellSlot";

  constructor(
    public spell: Spell,
    public actor: Combatant,
    public method: SpellcastingMethod,
  ) {
    this.name = "spell slot";
    this.type = "SpellSlot";
  }

  get min() {
    return this.method.getMinSlot?.(this.spell, this.actor) ?? this.spell.level;
  }

  get max() {
    return this.method.getMaxSlot?.(this.spell, this.actor) ?? this.spell.level;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (typeof value !== "number") ec.add("No spell level chosen", this);
    else {
      if (value < this.min) ec.add("Too low", this);
      if (value > this.max) ec.add("Too high", this);
    }

    return ec;
  }
}
