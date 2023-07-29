import { AttackRoll } from "../types/RollType";
import { BeforeAttackDetail } from "./BeforeAttackEvent";
import { DiceRolledDetail } from "./DiceRolledEvent";

export interface AttackDetail {
  pre: BeforeAttackDetail;
  roll: DiceRolledDetail<AttackRoll>;
  total: number;
  ac: number;
  outcome: "critical" | "hit" | "miss";
  forced: boolean;
}

export default class AttackEvent extends CustomEvent<AttackDetail> {
  constructor(detail: AttackDetail) {
    super("Attack", { detail });
  }
}
