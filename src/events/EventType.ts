import AbilityCheckEvent from "./AbilityCheckEvent";
import AfterActionEvent from "./AfterActionEvent";
import AreaPlacedEvent from "./AreaPlacedEvent";
import AreaRemovedEvent from "./AreaRemovedEvent";
import AttackEvent from "./AttackEvent";
import BeforeAttackEvent from "./BeforeAttackEvent";
import BeforeCheckEvent from "./BeforeCheckEvent";
import BeforeMoveEvent from "./BeforeMoveEvent";
import BeforeSaveEvent from "./BeforeSaveEvent";
import BoundedMoveEvent from "./BoundedMoveEvent";
import CheckActionEvent from "./CheckActionEvent";
import CombatantDamagedEvent from "./CombatantDamagedEvent";
import CombatantDiedEvent from "./CombatantDiedEvent";
import CombatantMovedEvent from "./CombatantMovedEvent";
import CombatantPlacedEvent from "./CombatantPlacedEvent";
import DiceRolledEvent from "./DiceRolledEvent";
import EffectAddedEvent from "./EffectAddedEvent";
import EffectRemovedEvent from "./EffectRemovedEvent";
import GatherDamageEvent from "./GatherDamageEvent";
import GetACEvent from "./GetACEvent";
import GetACMethodsEvent from "./GetACMethodsEvent";
import GetActionsEvent from "./GetActionsEvent";
import GetConditionsEvent from "./GetConditionsEvent";
import GetDamageResponseEvent from "./GetDamageResponseEvent";
import GetInitiativeEvent from "./GetInitiativeEvent";
import GetMoveCostEvent from "./GetMoveCostEvent";
import GetSpeedEvent from "./GetSpeedEvent";
import ListChoiceEvent from "./ListChoiceEvent";
import MultiListChoiceEvent from "./MultiListChoiceEvent";
import SaveEvent from "./SaveEvent";
import SpellCastEvent from "./SpellCastEvent";
import TurnEndedEvent from "./TurnEndedEvent";
import TurnStartedEvent from "./TurnStartedEvent";
import YesNoChoiceEvent from "./YesNoChoiceEvent";

export type EventTypes = {
  AbilityCheck: AbilityCheckEvent;
  AfterAction: AfterActionEvent;
  AreaPlaced: AreaPlacedEvent;
  AreaRemoved: AreaRemovedEvent;
  Attack: AttackEvent;
  BeforeAttack: BeforeAttackEvent;
  BeforeCheck: BeforeCheckEvent;
  BeforeMove: BeforeMoveEvent;
  BeforeSave: BeforeSaveEvent;
  BoundedMove: BoundedMoveEvent;
  CheckAction: CheckActionEvent;
  CombatantDamaged: CombatantDamagedEvent;
  CombatantDied: CombatantDiedEvent;
  CombatantMoved: CombatantMovedEvent;
  CombatantPlaced: CombatantPlacedEvent;
  DiceRolled: DiceRolledEvent;
  EffectAdded: EffectAddedEvent;
  EffectRemoved: EffectRemovedEvent;
  GatherDamage: GatherDamageEvent;
  GetAC: GetACEvent;
  GetACMethods: GetACMethodsEvent;
  GetActions: GetActionsEvent;
  GetConditions: GetConditionsEvent;
  GetDamageResponse: GetDamageResponseEvent;
  GetInitiative: GetInitiativeEvent;
  GetMoveCost: GetMoveCostEvent;
  GetSpeed: GetSpeedEvent;
  ListChoice: ListChoiceEvent;
  MultiListChoice: MultiListChoiceEvent;
  Save: SaveEvent;
  SpellCast: SpellCastEvent;
  TurnEnded: TurnEndedEvent;
  TurnStarted: TurnStartedEvent;
  YesNoChoice: YesNoChoiceEvent;
};

type EventType = keyof EventTypes;
export default EventType;
