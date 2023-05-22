import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import Action, { Resolver } from "../types/Action";
import Point from "../types/Point";
import { distanceTo } from "../utils/units";

function isPoint(value: unknown): value is Point {
  return (
    typeof value === "object" &&
    typeof (value as Point).x === "number" &&
    typeof (value as Point).y === "number"
  );
}

export default class PointResolver implements Resolver<Point> {
  type: "Point";

  constructor(public g: Engine, public maxRange: number) {
    this.type = "Point";
  }

  get name() {
    if (this.maxRange === Infinity) return "any point";
    return `point within ${this.maxRange}'`;
  }

  check(value: unknown, action: Action) {
    const ec = new ErrorCollector();

    if (!isPoint(value)) ec.add("Invalid", this);
    else {
      if (distanceTo(this.g, action.actor, value) > this.maxRange)
        ec.add("Out of range", this);
    }

    return ec;
  }
}
