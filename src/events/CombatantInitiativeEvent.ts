import Combatant from "../types/Combatant";
import DiceType from "../types/DiceType";

export interface CombatantInitiativeDetail {
  who: Combatant;
  diceType: DiceType;
  value: number;
}

export default class CombatantInitiativeEvent extends CustomEvent<CombatantInitiativeDetail> {
  constructor(detail: CombatantInitiativeDetail) {
    super("CombatantInitiative", { detail });
  }
}
