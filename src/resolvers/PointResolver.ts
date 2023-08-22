import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import Action from "../types/Action";
import Point from "../types/Point";
import Resolver from "../types/Resolver";
import { isPoint } from "../utils/types";
import { distanceTo } from "../utils/units";

export default class PointResolver implements Resolver<Point> {
  type: "Point";

  constructor(
    public g: Engine,
    public maxRange: number,
  ) {
    this.type = "Point";
  }

  get name() {
    if (this.maxRange === Infinity) return "any point";
    return `point within ${this.maxRange}'`;
  }

  check(value: unknown, action: Action, ec: ErrorCollector) {
    if (!isPoint(value)) ec.add("No target", this);
    else {
      if (distanceTo(this.g, action.actor, value) > this.maxRange)
        ec.add("Out of range", this);
    }

    return ec;
  }
}
