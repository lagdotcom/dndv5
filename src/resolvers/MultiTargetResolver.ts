import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import Action, { Resolver } from "../types/Action";
import Combatant from "../types/Combatant";
import { isCombatantArray } from "../utils/types";
import { distance } from "../utils/units";

export default class MultiTargetResolver implements Resolver<Combatant[]> {
  type: "Combatants";

  constructor(
    public g: Engine,
    public minimum: number,
    public maximum: number,
    public maxRange: number,
    public allowSelf = false
  ) {
    this.type = "Combatants";
  }

  get name() {
    const clauses: string[] = [];
    if (this.maxRange < Infinity)
      clauses.push(`target within ${this.maxRange}'`);
    if (!this.allowSelf) clauses.push("not self");

    return clauses.length ? clauses.join(", ") : "any target";
  }

  check(value: unknown, action: Action, ec = new ErrorCollector()) {
    if (!isCombatantArray(value)) ec.add("No target", this);
    else {
      for (const who of value) {
        if (!this.allowSelf && who === action.actor)
          ec.add("Cannot target self", this);
        if (distance(this.g, action.actor, who) > this.maxRange)
          ec.add("Out of range", this);
      }
    }

    return ec;
  }
}
