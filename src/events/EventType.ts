import AreaPlacedEvent from "./AreaPlacedEvent";
import AreaRemovedEvent from "./AreaRemovedEvent";
import AttackEvent from "./AttackEvent";
import BeforeAttackEvent from "./BeforeAttackEvent";
import BeforeCheckEvent from "./BeforeCheckEvent";
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
import ListChoiceEvent from "./ListChoiceEvent";
import SpellCastEvent from "./SpellCastEvent";
import TurnEndedEvent from "./TurnEndedEvent";
import TurnStartedEvent from "./TurnStartedEvent";
import YesNoChoiceEvent from "./YesNoChoiceEvent";

export type EventTypes = {
  AreaPlaced: AreaPlacedEvent;
  AreaRemoved: AreaRemovedEvent;
  Attack: AttackEvent;
  BeforeAttack: BeforeAttackEvent;
  BeforeCheck: BeforeCheckEvent;
  BeforeSave: BeforeSaveEvent;
  CombatantDamaged: CombatantDamagedEvent;
  CombatantDied: CombatantDiedEvent;
  CombatantMoved: CombatantMovedEvent;
  CombatantPlaced: CombatantPlacedEvent;
  DiceRolled: DiceRolledEvent;
  EffectAdded: EffectAddedEvent;
  EffectRemoved: EffectRemovedEvent;
  GatherDamage: GatherDamageEvent;
  GetACMethods: GetACMethodsEvent;
  GetActions: GetActionsEvent;
  GetConditions: GetConditionsEvent;
  GetDamageResponse: GetDamageResponseEvent;
  GetInitiative: GetInitiativeEvent;
  GetSpeed: GetSpeedEvent;
  ListChoice: ListChoiceEvent;
  SpellCast: SpellCastEvent;
  TurnEnded: TurnEndedEvent;
  TurnStarted: TurnStartedEvent;
  YesNoChoice: YesNoChoiceEvent;
};

type EventType = keyof EventTypes;
export default EventType;
