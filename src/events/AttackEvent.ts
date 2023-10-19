import AttackOutcomeCollector from "../collectors/AttackOutcomeCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import { AttackRoll } from "../types/RollType";
import { BeforeAttackDetail } from "./BeforeAttackEvent";
import { DiceRolledDetail } from "./DiceRolledEvent";

export interface AttackDetail {
  pre: BeforeAttackDetail;
  roll: DiceRolledDetail<AttackRoll>;
  total: number;
  ac: number;
  outcome: AttackOutcomeCollector;
  interrupt: InterruptionCollector;
}

export default class AttackEvent extends CustomEvent<AttackDetail> {
  constructor(detail: AttackDetail) {
    super("Attack", { detail });
  }
}
