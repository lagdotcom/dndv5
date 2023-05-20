import { Resolver } from "../types/Action";
import Point from "../types/Point";

export default class PointResolver implements Resolver<Point> {
  type: "Point";

  constructor(public maxRange: number) {
    this.type = "Point";
  }

  check(value: unknown): value is Point {
    return (
      typeof value === "object" &&
      typeof (value as Point).x === "number" &&
      typeof (value as Point).y === "number"
    );
  }
}
