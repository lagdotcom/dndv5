import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { Feet } from "../flavours";
import Action from "../types/Action";
import Point from "../types/Point";
import Resolver from "../types/Resolver";
import { describePoint, describeRange } from "../utils/text";
import { isPointArray } from "../utils/types";
import { distanceTo } from "../utils/units";

export default class MultiPointResolver implements Resolver<Point[]> {
  type: "Points";

  constructor(
    public g: Engine,
    public minimum: number,
    public maximum: number,
    public maxRange: Feet,
  ) {
    this.type = "Points";
  }

  get name() {
    return `${describeRange(this.minimum, this.maximum)} points${
      this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""
    }`;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (!isPointArray(value)) ec.add("No points", this);
    else {
      if (value.length < this.minimum)
        ec.add(`At least ${this.minimum} points`, this);
      if (value.length > this.maximum)
        ec.add(`At most ${this.maximum} points`, this);

      for (const point of value) {
        if (distanceTo(action.actor, point) > this.maxRange)
          ec.add(`(${describePoint(point)}): Out of range`, this);
      }
    }

    return ec;
  }
}
