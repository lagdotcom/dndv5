import { AttackRoll } from "../types/RollType";
import { BeforeAttackDetail } from "./BeforeAttackEvent";
import { DiceRolledDetail } from "./DiceRolledEvent";

export interface AttackEventDetail {
  pre: BeforeAttackDetail;
  roll: DiceRolledDetail<AttackRoll>;
  total: number;
  ac: number;
  outcome: "critical" | "hit" | "miss";
  forced: boolean;
}

export default class AttackEvent extends CustomEvent<AttackEventDetail> {
  constructor(detail: AttackEventDetail) {
    super("Attack", { detail });
  }
}
