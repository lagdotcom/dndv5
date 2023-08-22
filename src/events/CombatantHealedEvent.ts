import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";

export interface CombatantHealedDetail {
  who: Combatant;
  actor: Combatant;
  amount: number;
  fullAmount: number;
  interrupt: InterruptionCollector;
}

export default class CombatantHealedEvent extends CustomEvent<CombatantHealedDetail> {
  constructor(detail: CombatantHealedDetail) {
    super("CombatantHealed", { detail });
  }
}
