import { ModifiedDiceRoll } from "../flavours";
import Combatant from "../types/Combatant";
import DiceType from "../types/DiceType";
import { InitiativeRoll } from "../types/RollType";
import { DiceRolledDetail } from "./DiceRolledEvent";
import { GetInitiativeDetail } from "./GetInitiativeEvent";

export interface CombatantInitiativeDetail {
  who: Combatant;
  diceType: DiceType;
  value: ModifiedDiceRoll;
  pre: GetInitiativeDetail;
  roll: DiceRolledDetail<InitiativeRoll>;
}

export default class CombatantInitiativeEvent extends CustomEvent<CombatantInitiativeDetail> {
  constructor(detail: CombatantInitiativeDetail) {
    super("CombatantInitiative", { detail });
  }
}
