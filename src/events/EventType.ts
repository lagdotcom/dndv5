import AreaPlacedEvent from "./AreaPlacedEvent";
import AreaRemovedEvent from "./AreaRemovedEvent";
import AttackEvent from "./AttackEvent";
import BeforeAttackEvent from "./BeforeAttackEvent";
import CombatantDamagedEvent from "./CombatantDamagedEvent";
import CombatantDiedEvent from "./CombatantDiedEvent";
import CombatantMovedEvent from "./CombatantMovedEvent";
import CombatantPlacedEvent from "./CombatantPlacedEvent";
import DiceRolledEvent from "./DiceRolledEvent";
import GatherDamageEvent from "./GatherDamageEvent";
import GetACMethodsEvent from "./GetACMethodsEvent";
import GetActionsEvent from "./GetActionsEvent";
import GetDamageResponseEvent from "./GetDamageResponseEvent";
import SpellCastEvent from "./SpellCastEvent";
import TurnStartedEvent from "./TurnStartedEvent";

export type EventTypes = {
  areaPlaced: AreaPlacedEvent;
  areaRemoved: AreaRemovedEvent;
  attack: AttackEvent;
  beforeAttack: BeforeAttackEvent;
  combatantDamaged: CombatantDamagedEvent;
  combatantDied: CombatantDiedEvent;
  combatantMoved: CombatantMovedEvent;
  combatantPlaced: CombatantPlacedEvent;
  diceRolled: DiceRolledEvent;
  gatherDamage: GatherDamageEvent;
  getACMethods: GetACMethodsEvent;
  getActions: GetActionsEvent;
  getDamageResponse: GetDamageResponseEvent;
  spellCast: SpellCastEvent;
  turnStarted: TurnStartedEvent;
};

type EventType = keyof EventTypes;
export default EventType;
