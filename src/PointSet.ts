import { HalfSquareSize } from "./MapSquare";
import Point from "./types/Point";
import { mapSet, SetInitialiser } from "./utils/set";

type PointTag = string;

function asPoint(tag: PointTag): Point {
  const [x, y] = tag.split(",").map(Number);
  return { x, y };
}

const asTag = ({ x, y }: Point) => `${x},${y}`;

export default class PointSet {
  set: Set<PointTag>;

  constructor(points: SetInitialiser<Point> = []) {
    this.set = new Set(mapSet(points, asTag));
  }

  add(p: Point) {
    return this.set.add(asTag(p));
  }

  delete(p: Point) {
    return this.set.delete(asTag(p));
  }

  has(p: Point) {
    return this.set.has(asTag(p));
  }

  overlaps(ps: Iterable<Point>) {
    for (const point of ps) {
      if (this.has(point)) return true;
    }

    return false;
  }

  *[Symbol.iterator]() {
    for (const tag of this.set) yield asPoint(tag);
  }

  average(scaleValue = 1, offset = HalfSquareSize): Point {
    let count = 0;
    let x = 0;
    let y = 0;

    for (const p of this) {
      count++;
      x += p.x;
      y += p.y;
    }

    return {
      x: (x / count + offset) * scaleValue,
      y: (y / count + offset) * scaleValue,
    };
  }
}
