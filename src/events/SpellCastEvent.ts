import InterruptionCollector from "../collectors/InterruptionCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface SpellCastDetail<T extends object = object> {
  who: Combatant;
  spell: Spell<T>;
  method: SpellcastingMethod;
  level: number;
  targets: Set<Combatant>;
  affected: Set<Combatant>;
  interrupt: InterruptionCollector;
  success: SuccessResponseCollector;
}

export default class SpellCastEvent<
  T extends object = object,
> extends CustomEvent<SpellCastDetail<T>> {
  constructor(detail: SpellCastDetail<T>) {
    super("SpellCast", { detail });
  }
}
