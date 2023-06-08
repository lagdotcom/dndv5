import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
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
    public allowSelf = false
  ) {
    this.type = "Combatants";
  }

  get name() {
    return `${describeRange(this.minimum, this.maximum)} targets${
      this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""
    }${this.allowSelf ? "" : ", not self"}`;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (!isCombatantArray(value)) ec.add("No target", this);
    else {
      if (value.length < this.minimum)
        ec.add(`At least ${this.minimum} targets`, this);
      if (value.length > this.maximum)
        ec.add(`At most ${this.maximum} targets`, this);

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
