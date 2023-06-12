import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface SpellCastDetail<T extends object = object> {
  who: Combatant;
  spell: Spell<T>;
  method: SpellcastingMethod;
  level: number;
  targets: Set<Combatant>;
  interrupt: InterruptionCollector;
}

export default class SpellCastEvent<
  T extends object = object
> extends CustomEvent<SpellCastDetail<T>> {
  constructor(detail: SpellCastDetail<T>) {
    super("SpellCast", { detail });
  }
}
