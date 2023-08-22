import InterruptionCollector from "../collectors/InterruptionCollector";
import DiceType from "../types/DiceType";
import RollType from "../types/RollType";

export interface DiceRolledDetail<T extends RollType> {
  type: T;
  diceType: DiceType;
  size: number;
  value: number;
  otherValues: number[];
  interrupt: InterruptionCollector;
}

export default class DiceRolledEvent<
  T extends RollType = RollType,
> extends CustomEvent<DiceRolledDetail<T>> {
  constructor(detail: DiceRolledDetail<T>) {
    super("DiceRolled", { detail });
  }
}
