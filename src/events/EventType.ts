import CombatantDamagedEvent from "./CombatantDamagedEvent";
import CombatantDiedEvent from "./CombatantDiedEvent";
import CombatantMovedEvent from "./CombatantMovedEvent";
import CombatantPlacedEvent from "./CombatantPlacedEvent";
import DiceRolledEvent from "./DiceRolledEvent";
import GetACMethodsEvent from "./GetACMethodsEvent";
import GetActionsEvent from "./GetActionsEvent";
import TurnStartedEvent from "./TurnStartedEvent";

export type EventTypes = {
  combatantDamaged: CombatantDamagedEvent;
  combatantDied: CombatantDiedEvent;
  combatantMoved: CombatantMovedEvent;
  combatantPlaced: CombatantPlacedEvent;
  diceRolled: DiceRolledEvent;
  getACMethods: GetACMethodsEvent;
  getActions: GetActionsEvent;
  turnStarted: TurnStartedEvent;
};

type EventType = keyof EventTypes;
export default EventType;
