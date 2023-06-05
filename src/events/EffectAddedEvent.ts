import Combatant from "../types/Combatant";
import CombatantEffect from "../types/CombatantEffect";

export interface EffectAddedDetail {
  who: Combatant;
  effect: CombatantEffect;
  duration: number;
}

export default class EffectAddedEvent extends CustomEvent<EffectAddedDetail> {
  constructor(detail: EffectAddedDetail) {
    super("EffectAdded", { detail });
  }
}
