import AbstractCombatant from "../AbstractCombatant";
import Engine from "../Engine";
import Action, { Resolver } from "../types/Action";
import Combatant from "../types/Combatant";
import { distance } from "../utils/units";

export default class TargetResolver implements Resolver<Combatant> {
  type: "Combatant";

  constructor(
    public g: Engine,
    public maxRange: number,
    public allowSelf = false
  ) {
    this.type = "Combatant";
  }

  check(value: unknown, action: Action): value is Combatant {
    return (
      value instanceof AbstractCombatant &&
      (this.allowSelf || value !== action.actor) &&
      distance(this.g, action.actor, value) <= this.maxRange
    );
  }
}
