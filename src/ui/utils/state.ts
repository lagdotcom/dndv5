import BoundedMoveEvent from "../../events/BoundedMoveEvent";
import ListChoiceEvent from "../../events/ListChoiceEvent";
import MultiListChoiceEvent from "../../events/MultiListChoiceEvent";
import YesNoChoiceEvent from "../../events/YesNoChoiceEvent";
import { CombatantID, SideID } from "../../flavours";
import Action from "../../types/Action";
import Combatant from "../../types/Combatant";
import EffectArea, { SpecifiedEffectShape } from "../../types/EffectArea";
import MoveDirection from "../../types/MoveDirection";
import MoveHandler from "../../types/MoveHandler";
import Point from "../../types/Point";
import { CompleteEvaluation } from "../../utils/ai";
import { batch, computed, signal } from "../lib";
import { UnitData } from "./types";

export type Wants<T> = (point?: T) => void;

export const actionAreas = signal<SpecifiedEffectShape[] | undefined>(
  undefined,
);

export const activeCombatantId = signal<CombatantID>(NaN);

export const activeCombatant = computed(() =>
  allCombatants.value.find((u) => u.id === activeCombatantId.value),
);

export const aiEvaluation = signal<CompleteEvaluation | undefined>(undefined);

export const allActions = signal<Action[]>([]);

export const allCombatants = signal<UnitData[]>([]);

export const allEffects = signal<EffectArea[]>([]);

export const canDragUnits = signal<boolean>(false);

export const canMoveDirections = signal<MoveDirection[]>([]);

export const chooseFromList = signal<ListChoiceEvent | undefined>(undefined);

export const chooseManyFromList = signal<MultiListChoiceEvent | undefined>(
  undefined,
);

export const chooseYesNo = signal<YesNoChoiceEvent | undefined>(undefined);

export const moveBounds = signal<BoundedMoveEvent | undefined>(undefined);

export const moveHandler = signal<MoveHandler | undefined>(undefined);

export const movingCombatantId = signal<CombatantID>(NaN);

export const movingCombatant = computed(() =>
  allCombatants.value.find((u) => u.id === movingCombatantId.value),
);

export const scale = signal(20);

export const showSideHP = signal<SideID[]>([0]);

export const showSideUnderlay = signal<boolean>(false);

export const teleportInfo = signal<SpecifiedEffectShape | undefined>(undefined);

export const wantsCombatant = signal<Wants<Combatant> | undefined>(undefined);

export const wantsPoint = signal<Wants<Point> | undefined>(undefined);

const uiState = {
  actionAreas,
  activeCombatantId,
  activeCombatant,
  aiEvaluation,
  allActions,
  allCombatants,
  allEffects,
  canDragUnits,
  canMoveDirections,
  chooseFromList,
  chooseManyFromList,
  chooseYesNo,
  moveBounds,
  moveHandler,
  movingCombatantId,
  movingCombatant,
  scale,
  showSideHP,
  showSideUnderlay,
  teleportInfo,
  wantsCombatant,
  wantsPoint,
};
export type UIState = typeof uiState;
if (MODE !== "test") window.state = uiState;

export const resetAllState = (continuation?: () => void) =>
  batch(() => {
    actionAreas.value = [];
    activeCombatantId.value = NaN;
    aiEvaluation.value = undefined;
    allActions.value = [];
    allCombatants.value = [];
    allEffects.value = [];
    canDragUnits.value = false;
    chooseFromList.value = undefined;
    chooseManyFromList.value = undefined;
    chooseYesNo.value = undefined;
    moveBounds.value = undefined;
    moveHandler.value = undefined;
    movingCombatantId.value = NaN;
    showSideHP.value = [0];
    showSideUnderlay.value = false;
    teleportInfo.value = undefined;
    wantsCombatant.value = undefined;
    wantsPoint.value = undefined;
    continuation?.();
  });
