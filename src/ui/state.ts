import { signal } from "@preact/signals";

import Action from "../types/Action";
import Combatant from "../types/Combatant";
import CombatantState from "../types/CombatantState";
import EffectArea from "../types/EffectArea";
import Point from "../types/Point";

export interface CombatantAndState {
  who: Combatant;
  state: CombatantState;
}

export type Listener<T> = (point?: T) => void;

export const activeCombatant = signal<Combatant | undefined>(undefined);

export const allActions = signal<Action[]>([]);

export const allCombatants = signal<CombatantAndState[]>([]);

export const allEffects = signal<EffectArea[]>([]);

export const scale = signal(20);

export const wantsCombatant = signal<Listener<Combatant> | undefined>(
  undefined
);

export const wantsPoint = signal<Listener<Point> | undefined>(undefined);

(window as any).state = {
  activeCombatant,
  allActions,
  allEffects,
  allCombatants,
  scale,
  wantsPoint,
};
