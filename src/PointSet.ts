import Point from "./types/Point";

function asPoint(tag: string): Point {
  const [x, y] = tag.split(",").map(Number);
  return { x, y };
}

const asTag = ({ x, y }: Point) => `${x},${y}`;

export default class PointSet {
  set: Set<string>;

  constructor(points?: Point[]) {
    this.set = new Set(points?.map(asTag));
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
}
