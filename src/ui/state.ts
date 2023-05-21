import { computed, signal } from "@preact/signals";

import Action from "../types/Action";
import Combatant from "../types/Combatant";
import CombatantState from "../types/CombatantState";

export interface CombatantAndState {
  who: Combatant;
  state: CombatantState;
}

export const activeCombatant = signal<Combatant | undefined>(undefined);

export const allActions = signal<Action[]>([]);

export const allCombatants = signal<CombatantAndState[]>([]);
export const aliveCombatants = computed(() =>
  allCombatants.value.filter((c) => c.who.hp > 0)
);

(window as any).state = { activeCombatant, allActions, allCombatants };
