import Combatant from "../types/Combatant";

export interface CombatantFinalisingDetail {
  who: Combatant;
}

export default class CombatantFinalisingEvent extends CustomEvent<CombatantFinalisingDetail> {
  constructor(detail: CombatantFinalisingDetail) {
    super("CombatantFinalising", { detail });
  }
}
