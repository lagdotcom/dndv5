import InterruptionCollector from "../collectors/InterruptionCollector";
import AttackOutcome from "../types/AttackOutcome";
import Combatant from "../types/Combatant";
import { AttackDetail } from "./AttackEvent";

export interface AfterAttackDetail {
  outcome: AttackOutcome;
  attack: AttackDetail;
  hit: boolean;
  critical: boolean;
  target: Combatant;
  interrupt: InterruptionCollector;
}

export default class AfterAttackEvent extends CustomEvent<AfterAttackDetail> {
  constructor(detail: AfterAttackDetail) {
    super("AfterAttack", { detail });
  }
}
