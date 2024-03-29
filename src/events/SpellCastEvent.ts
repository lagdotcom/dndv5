import InterruptionCollector from "../collectors/InterruptionCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import { SpellSlot } from "../flavours";
import Combatant from "../types/Combatant";
import Empty from "../types/Empty";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface SpellCastDetail<T extends object = Empty> {
  who: Combatant;
  spell: Spell<T>;
  method: SpellcastingMethod;
  level: SpellSlot;
  targets: Set<Combatant>;
  affected: Set<Combatant>;
  interrupt: InterruptionCollector;
  success: SuccessResponseCollector;
}

export default class SpellCastEvent<
  T extends object = Empty,
> extends CustomEvent<SpellCastDetail<T>> {
  constructor(detail: SpellCastDetail<T>) {
    super("SpellCast", { detail });
  }
}
