import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import Resolver from "../types/Resolver";
import { describeRange } from "../utils/text";
import { distance } from "../utils/units";

export interface Allocation {
  who: Combatant;
  amount: number;
}

function isAllocation(value: unknown): value is Allocation {
  return (
    typeof value === "object" &&
    typeof (value as Allocation).amount === "number" &&
    typeof (value as Allocation).who === "object"
  );
}

function isAllocationArray(value: unknown): value is Allocation[] {
  if (!Array.isArray(value)) return false;
  for (const entry of value) {
    if (!isAllocation(entry)) return false;
  }
  return true;
}

export default class AllocationResolver implements Resolver<Allocation[]> {
  type: "Allocations";

  constructor(
    public g: Engine,
    public rangeName: string,
    public minimum: number,
    public maximum: number,
    public maxRange: number,
    public allowSelf = false,
  ) {
    this.type = "Allocations";
  }

  get name() {
    return `${this.rangeName}: ${describeRange(
      this.minimum,
      this.maximum,
    )} allocations${
      this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""
    }${this.allowSelf ? "" : ", not self"}`;
  }

  check(value: unknown, action: Action<object>, ec: ErrorCollector) {
    if (!isAllocationArray(value)) ec.add("No targets", this);
    else {
      const total = value.reduce((p, entry) => p + entry.amount, 0);
      if (total < this.minimum)
        ec.add(`At least ${this.minimum} allocations`, this);
      if (total > this.maximum)
        ec.add(`At most ${this.maximum} allocations`, this);

      for (const { who } of value) {
        if (!this.allowSelf && who === action.actor)
          ec.add("Cannot target self", this);
        if (distance(this.g, action.actor, who) > this.maxRange)
          ec.add("Out of range", this);
      }
    }

    return ec;
  }
}
