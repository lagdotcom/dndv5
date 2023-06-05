import Combatant from "../types/Combatant";
import CombatantEffect from "../types/CombatantEffect";

export interface EffectRemovedDetail {
  who: Combatant;
  effect: CombatantEffect;
  durationRemaining: number;
}

export default class EffectRemovedEvent extends CustomEvent<EffectRemovedDetail> {
  constructor(detail: EffectRemovedDetail) {
    super("EffectRemoved", { detail });
  }
}
