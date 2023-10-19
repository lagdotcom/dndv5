import InterruptionCollector from "../collectors/InterruptionCollector";
import ValueCollector from "../collectors/ValueCollector";
import DiceType from "../types/DiceType";
import RollType from "../types/RollType";

export interface DiceRolledDetail<T extends RollType> {
  type: T;
  diceType: DiceType;
  size: number;
  values: ValueCollector;
  interrupt: InterruptionCollector;
}

export default class DiceRolledEvent<
  T extends RollType = RollType,
> extends CustomEvent<DiceRolledDetail<T>> {
  constructor(detail: DiceRolledDetail<T>) {
    super("DiceRolled", { detail });
  }
}
