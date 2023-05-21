import { signal } from "@preact/signals";

import Action from "../types/Action";
import Combatant from "../types/Combatant";

export const activeCombatant = signal<Combatant | undefined>(undefined);

export const allActions = signal<Action[]>([]);

(window as any).state = { activeCombatant, allActions };
