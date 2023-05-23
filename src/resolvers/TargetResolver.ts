import AbstractCombatant from "../AbstractCombatant";
import ErrorCollector from "../collectors/ErrorCollector";
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

  get name() {
    const clauses: string[] = [];
    if (this.maxRange < Infinity)
      clauses.push(`target within ${this.maxRange}'`);
    if (!this.allowSelf) clauses.push("not self");

    return clauses.length ? clauses.join(", ") : "any target";
  }

  check(value: unknown, action: Action, ec = new ErrorCollector()) {
    if (!(value instanceof AbstractCombatant)) ec.add("No target", this);
    else {
      if (!this.allowSelf && value === action.actor)
        ec.add("Cannot target self", this);
      if (distance(this.g, action.actor, value) > this.maxRange)
        ec.add("Out of range", this);
    }

    return ec;
  }
}
