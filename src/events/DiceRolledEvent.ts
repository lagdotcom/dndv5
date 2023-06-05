import InterruptionCollector from "../collectors/InterruptionCollector";
import DiceType from "../types/DiceType";
import RollType from "../types/RollType";

export interface DiceRolledDetail {
  type: RollType;
  diceType: DiceType;
  size: number;
  value: number;
  otherValues: Set<number>;
  interrupt: InterruptionCollector;
}

export default class DiceRolledEvent extends CustomEvent<DiceRolledDetail> {
  constructor(detail: DiceRolledDetail) {
    super("DiceRolled", { detail });
  }
}
