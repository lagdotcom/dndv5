import AbstractCombatant from "../AbstractCombatant";
import { Resolver } from "../types/Action";
import Combatant from "../types/Combatant";
import ActionRange from "../types/Range";

export default class TargetResolver implements Resolver<Combatant> {
  type: "Combatant";

  constructor(public maxRange: ActionRange) {
    this.type = "Combatant";
  }

  check(value: unknown): value is Combatant {
    return value instanceof AbstractCombatant;
  }
}
