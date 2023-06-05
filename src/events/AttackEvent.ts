import { BeforeAttackDetail } from "./BeforeAttackEvent";
import { DiceRolledDetail } from "./DiceRolledEvent";

export interface AttackEventDetail {
  pre: BeforeAttackDetail;
  roll: DiceRolledDetail;
  total: number;
  outcome: "critical" | "hit" | "miss";
}

export default class AttackEventEvent extends CustomEvent<AttackEventDetail> {
  constructor(detail: AttackEventDetail) {
    super("Attack", { detail });
  }
}
