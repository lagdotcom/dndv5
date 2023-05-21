import Engine from "../Engine";
import Action, { Resolver } from "../types/Action";
import Point from "../types/Point";
import { distanceTo } from "../utils/units";

export default class PointResolver implements Resolver<Point> {
  type: "Point";

  constructor(public g: Engine, public maxRange: number) {
    this.type = "Point";
  }

  check(value: unknown, action: Action): value is Point {
    return (
      typeof value === "object" &&
      typeof (value as Point).x === "number" &&
      typeof (value as Point).y === "number" &&
      distanceTo(this.g, action.actor, value as Point) <= this.maxRange
    );
  }
}
