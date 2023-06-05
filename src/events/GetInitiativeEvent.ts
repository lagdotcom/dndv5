import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";

export interface GetInitiativeDetail {
  who: Combatant;
  bonus: BonusCollector;
  diceType: DiceTypeCollector;
  interrupt: InterruptionCollector;
}

export default class GetInitiativeEvent extends CustomEvent<GetInitiativeDetail> {
  constructor(detail: GetInitiativeDetail) {
    super("GetInitiative", { detail });
  }
}
