import ErrorCollector from "../collectors/ErrorCollector";
import CombatantBase from "../CombatantBase";
import Engine from "../Engine";
import { ErrorFilter } from "../filters";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import Resolver from "../types/Resolver";
import { distance } from "../utils/units";

export default class TargetResolver implements Resolver<Combatant> {
  type: "Combatant";

  constructor(
    public g: Engine,
    public maxRange: number,
    public filters: ErrorFilter<Combatant>[],
  ) {
    this.type = "Combatant";
  }

  get name() {
    const clauses: string[] = [];
    if (this.maxRange < Infinity)
      clauses.push(`target within ${this.maxRange}'`);
    clauses.push(...this.filters.map((f) => f.name));

    return clauses.length ? clauses.join(", ") : "any target";
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (!(value instanceof CombatantBase)) {
      ec.add("No target", this);
    } else {
      const isOutOfRange = distance(action.actor, value) > this.maxRange;
      const errors = this.filters
        .filter((filter) => !filter.check(this.g, action, value))
        .map((filter) => filter.message);

      if (isOutOfRange) ec.add("Out of range", this);
      ec.addMany(errors, this);
    }

    return ec;
  }
}
