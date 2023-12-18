import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";
import DamageBreakdown from "../types/DamageBreakdown";
import DamageType from "../types/DamageType";
import Source from "../types/Source";
import { AttackDetail } from "./AttackEvent";

export interface CombatantDamagedDetail {
  who: Combatant;
  attack?: AttackDetail;
  attacker?: Combatant;
  total: number;
  takenByTemporaryHP: number;
  afterTemporaryHP: number;
  temporaryHPSource?: Source;
  breakdown: Map<DamageType, DamageBreakdown>;
  interrupt: InterruptionCollector;
}

export default class CombatantDamagedEvent extends CustomEvent<CombatantDamagedDetail> {
  constructor(detail: CombatantDamagedDetail) {
    super("CombatantDamaged", { detail });
  }
}
