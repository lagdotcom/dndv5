import { computed, signal } from "@preact/signals";

import ListChoiceEvent from "../../events/ListChoiceEvent";
import YesNoChoiceEvent from "../../events/YesNoChoiceEvent";
import Action from "../../types/Action";
import Combatant from "../../types/Combatant";
import EffectArea, { SpecifiedEffectShape } from "../../types/EffectArea";
import Point from "../../types/Point";
import { UnitData } from "./types";

export type Listener<T> = (point?: T) => void;

export const actionAreas = signal<SpecifiedEffectShape[] | undefined>(
  undefined
);

export const activeCombatantId = signal<number>(NaN);

export const activeCombatant = computed(() =>
  allCombatants.value.find((u) => u.id === activeCombatantId.value)
);

export const allActions = signal<Action[]>([]);

export const allCombatants = signal<UnitData[]>([]);

export const allEffects = signal<EffectArea[]>([]);

export const chooseFromList = signal<ListChoiceEvent | undefined>(undefined);

export const chooseYesNo = signal<YesNoChoiceEvent | undefined>(undefined);

export const scale = signal(20);

export const wantsCombatant = signal<Listener<Combatant> | undefined>(
  undefined
);

export const wantsPoint = signal<Listener<Point> | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).state = {
  actionAreas,
  activeCombatantId,
  activeCombatant,
  allActions,
  allCombatants,
  allEffects,
  chooseFromList,
  chooseYesNo,
  scale,
  wantsCombatant,
  wantsPoint,
};