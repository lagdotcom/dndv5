import AreaPlacedEvent from "./AreaPlacedEvent";
import AreaRemovedEvent from "./AreaRemovedEvent";
import AttackEvent from "./AttackEvent";
import BeforeAttackEvent from "./BeforeAttackEvent";
import BeforeSaveEvent from "./BeforeSaveEvent";
import CombatantDamagedEvent from "./CombatantDamagedEvent";
import CombatantDiedEvent from "./CombatantDiedEvent";
import CombatantMovedEvent from "./CombatantMovedEvent";
import CombatantPlacedEvent from "./CombatantPlacedEvent";
import DiceRolledEvent from "./DiceRolledEvent";
import EffectAddedEvent from "./EffectAddedEvent";
import EffectRemovedEvent from "./EffectRemovedEvent";
import GatherDamageEvent from "./GatherDamageEvent";
import GetACMethodsEvent from "./GetACMethodsEvent";
import GetActionsEvent from "./GetActionsEvent";
import GetConditionsEvent from "./GetConditionsEvent";
import GetDamageResponseEvent from "./GetDamageResponseEvent";
import GetInitiativeEvent from "./GetInitiativeEvent";
import GetSpeedEvent from "./GetSpeedEvent";
import SpellCastEvent from "./SpellCastEvent";
import TurnEndedEvent from "./TurnEndedEvent";
import TurnStartedEvent from "./TurnStartedEvent";
import YesNoChoiceEvent from "./YesNoChoiceEvent";

export type EventTypes = {
  areaPlaced: AreaPlacedEvent;
  areaRemoved: AreaRemovedEvent;
  attack: AttackEvent;
  beforeAttack: BeforeAttackEvent;
  beforeSave: BeforeSaveEvent;
  combatantDamaged: CombatantDamagedEvent;
  combatantDied: CombatantDiedEvent;
  combatantMoved: CombatantMovedEvent;
  combatantPlaced: CombatantPlacedEvent;
  diceRolled: DiceRolledEvent;
  effectAdded: EffectAddedEvent;
  effectRemoved: EffectRemovedEvent;
  gatherDamage: GatherDamageEvent;
  getACMethods: GetACMethodsEvent;
  getActions: GetActionsEvent;
  getConditions: GetConditionsEvent;
  getDamageResponse: GetDamageResponseEvent;
  getInitiative: GetInitiativeEvent;
  getSpeed: GetSpeedEvent;
  spellCast: SpellCastEvent;
  turnEnded: TurnEndedEvent;
  turnStarted: TurnStartedEvent;
  yesNoChoice: YesNoChoiceEvent;
};

type EventType = keyof EventTypes;
export default EventType;
