import AbilityCheckEvent from "./AbilityCheckEvent";
import AfterActionEvent from "./AfterActionEvent";
import AfterAttackEvent from "./AfterAttackEvent";
import AreaPlacedEvent from "./AreaPlacedEvent";
import AreaRemovedEvent from "./AreaRemovedEvent";
import AttackEvent from "./AttackEvent";
import BattleStartedEvent from "./BattleStartedEvent";
import BeforeAttackEvent from "./BeforeAttackEvent";
import BeforeCheckEvent from "./BeforeCheckEvent";
import BeforeEffectEvent from "./BeforeEffectEvent";
import BeforeMoveEvent from "./BeforeMoveEvent";
import BeforeSaveEvent from "./BeforeSaveEvent";
import BoundedMoveEvent from "./BoundedMoveEvent";
import CheckActionEvent from "./CheckActionEvent";
import CheckHearingEvent from "./CheckHearingEvent";
import CheckVisionEvent from "./CheckVisionEvent";
import CombatantDamagedEvent from "./CombatantDamagedEvent";
import CombatantDiedEvent from "./CombatantDiedEvent";
import CombatantFinalisingEvent from "./CombatantFinalising";
import CombatantHealedEvent from "./CombatantHealedEvent";
import CombatantInitiativeEvent from "./CombatantInitiativeEvent";
import CombatantMovedEvent from "./CombatantMovedEvent";
import CombatantPlacedEvent from "./CombatantPlacedEvent";
import DiceRolledEvent from "./DiceRolledEvent";
import EffectAddedEvent from "./EffectAddedEvent";
import EffectRemovedEvent from "./EffectRemovedEvent";
import ExhaustionEvent from "./ExhaustionEvent";
import GatherDamageEvent from "./GatherDamageEvent";
import GatherHealEvent from "./GatherHealEvent";
import GetACEvent from "./GetACEvent";
import GetACMethodsEvent from "./GetACMethodsEvent";
import GetActionsEvent from "./GetActionsEvent";
import GetConditionsEvent from "./GetConditionsEvent";
import GetDamageResponseEvent from "./GetDamageResponseEvent";
import GetInitiativeEvent from "./GetInitiativeEvent";
import GetMaxHPEvent from "./GetMaxHPEvent";
import GetMoveCostEvent from "./GetMoveCostEvent";
import GetSaveDCEvent from "./GetSaveDCEvent";
import GetSpeedEvent from "./GetSpeedEvent";
import GetTerrainEvent from "./GetTerrainEvent";
import ListChoiceEvent from "./ListChoiceEvent";
import MultiListChoiceEvent from "./MultiListChoiceEvent";
import SaveEvent from "./SaveEvent";
import SpellCastEvent from "./SpellCastEvent";
import TextEvent from "./TextEvent";
import TurnEndedEvent from "./TurnEndedEvent";
import TurnSkippedEvent from "./TurnSkippedEvent";
import TurnStartedEvent from "./TurnStartedEvent";
import YesNoChoiceEvent from "./YesNoChoiceEvent";

export interface EventTypes {
  AbilityCheck: AbilityCheckEvent;
  AfterAction: AfterActionEvent;
  AfterAttack: AfterAttackEvent;
  AreaPlaced: AreaPlacedEvent;
  AreaRemoved: AreaRemovedEvent;
  Attack: AttackEvent;
  BattleStarted: BattleStartedEvent;
  BeforeAttack: BeforeAttackEvent;
  BeforeCheck: BeforeCheckEvent;
  BeforeEffect: BeforeEffectEvent;
  BeforeMove: BeforeMoveEvent;
  BeforeSave: BeforeSaveEvent;
  BoundedMove: BoundedMoveEvent;
  CheckAction: CheckActionEvent;
  CheckHearing: CheckHearingEvent;
  CheckVision: CheckVisionEvent;
  CombatantDamaged: CombatantDamagedEvent;
  CombatantDied: CombatantDiedEvent;
  CombatantFinalising: CombatantFinalisingEvent;
  CombatantHealed: CombatantHealedEvent;
  CombatantInitiative: CombatantInitiativeEvent;
  CombatantMoved: CombatantMovedEvent;
  CombatantPlaced: CombatantPlacedEvent;
  DiceRolled: DiceRolledEvent;
  EffectAdded: EffectAddedEvent;
  EffectRemoved: EffectRemovedEvent;
  Exhaustion: ExhaustionEvent;
  GatherDamage: GatherDamageEvent;
  GatherHeal: GatherHealEvent;
  GetAC: GetACEvent;
  GetACMethods: GetACMethodsEvent;
  GetActions: GetActionsEvent;
  GetConditions: GetConditionsEvent;
  GetDamageResponse: GetDamageResponseEvent;
  GetInitiative: GetInitiativeEvent;
  GetMaxHP: GetMaxHPEvent;
  GetMoveCost: GetMoveCostEvent;
  GetSaveDC: GetSaveDCEvent;
  GetSpeed: GetSpeedEvent;
  GetTerrain: GetTerrainEvent;
  ListChoice: ListChoiceEvent;
  MultiListChoice: MultiListChoiceEvent;
  Save: SaveEvent;
  SpellCast: SpellCastEvent;
  Text: TextEvent;
  TurnEnded: TurnEndedEvent;
  TurnSkipped: TurnSkippedEvent;
  TurnStarted: TurnStartedEvent;
  YesNoChoice: YesNoChoiceEvent;
}

type EventType = keyof EventTypes;
export default EventType;
