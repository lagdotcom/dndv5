import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { ErrorFilter } from "../filters";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import Resolver from "../types/Resolver";
import { describeRange } from "../utils/text";
import { isCombatantArray } from "../utils/types";
import { distance } from "../utils/units";

export default class MultiTargetResolver implements Resolver<Combatant[]> {
  type: "Combatants";

  constructor(
    public g: Engine,
    public minimum: number,
    public maximum: number,
    public maxRange: number,
    public filters: ErrorFilter<Combatant>[],
  ) {
    this.type = "Combatants";
  }

  get name() {
    let name = `${describeRange(this.minimum, this.maximum)} targets${
      this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""
    }`;
    for (const filter of this.filters) name += `, ${filter.name}`;
    return name;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (!isCombatantArray(value)) {
      ec.add("No target", this);
    } else {
      if (value.length < this.minimum)
        ec.add(`At least ${this.minimum} targets`, this);
      if (value.length > this.maximum)
        ec.add(`At most ${this.maximum} targets`, this);

      for (const who of value) {
        const isOutOfRange = distance(action.actor, who) > this.maxRange;
        const filterErrors = this.filters
          .filter((filter) => !filter.check(this.g, action, who))
          .map((filter) => filter.message);

        if (isOutOfRange) ec.add(`${who.name}: Out of range`, this);
        for (const error of filterErrors) ec.add(`${who.name}: ${error}`, this);
      }
    }

    return ec;
  }
}
