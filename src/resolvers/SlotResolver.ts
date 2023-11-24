import { isCastSpell } from "../actions/CastSpell";
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
    public method: SpellcastingMethod,
  ) {
    this.name = "spell slot";
    this.type = "SpellSlot";
  }

  getMinimum(who: Combatant) {
    return this.method.getMinSlot?.(this.spell, who) ?? this.spell.level;
  }

  getMaximum(who: Combatant) {
    return this.method.getMaxSlot?.(this.spell, who) ?? this.spell.level;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (isCastSpell(action)) this.method = action.method;

    if (typeof value !== "number") ec.add("No spell level chosen", this);
    else {
      if (value < this.getMinimum(action.actor)) ec.add("Too low", this);
      if (value > this.getMaximum(action.actor)) ec.add("Too high", this);
    }

    return ec;
  }
}
