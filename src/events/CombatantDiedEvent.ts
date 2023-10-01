import Combatant from "../types/Combatant";

export interface CombatantDiedDetail {
  who: Combatant;
  attacker?: Combatant;
}

export default class CombatantDiedEvent extends CustomEvent<CombatantDiedDetail> {
  constructor(detail: CombatantDiedDetail) {
    super("CombatantDied", { detail });
  }
}
