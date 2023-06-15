import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";
import DamageBreakdown from "../types/DamageBreakdown";
import DamageType from "../types/DamageType";

export interface CombatantDamagedDetail {
  who: Combatant;
  attacker: Combatant;
  total: number;
  breakdown: Map<DamageType, DamageBreakdown>;
  interrupt: InterruptionCollector;
}

export default class CombatantDamagedEvent extends CustomEvent<CombatantDamagedDetail> {
  constructor(detail: CombatantDamagedDetail) {
    super("CombatantDamaged", { detail });
  }
}
