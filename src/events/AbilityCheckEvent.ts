import { DifficultyClass, ModifiedDiceRoll } from "../flavours";
import DiceType from "../types/DiceType";
import { AbilityCheck } from "../types/RollType";
import { BeforeCheckDetail } from "./BeforeCheckEvent";
import { DiceRolledDetail } from "./DiceRolledEvent";

export interface AbilityCheckDetail {
  pre: BeforeCheckDetail;
  roll: DiceRolledDetail<AbilityCheck>;
  diceType: DiceType;
  total: ModifiedDiceRoll;
  dc: DifficultyClass;
  outcome: "success" | "fail";
  forced: boolean;
}

export default class AbilityCheckEvent extends CustomEvent<AbilityCheckDetail> {
  constructor(detail: AbilityCheckDetail) {
    super("AbilityCheck", { detail });
  }
}
