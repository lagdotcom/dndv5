import { AbilityCheck } from "../types/RollType";
import { BeforeCheckDetail } from "./BeforeCheckEvent";
import { DiceRolledDetail } from "./DiceRolledEvent";

export interface AbilityCheckEventDetail {
  pre: BeforeCheckDetail;
  roll: DiceRolledDetail<AbilityCheck>;
  total: number;
  dc: number;
  outcome: "success" | "fail";
  forced: boolean;
}

export default class AbilityCheckEvent extends CustomEvent<AbilityCheckEventDetail> {
  constructor(detail: AbilityCheckEventDetail) {
    super("AbilityCheck", { detail });
  }
}
