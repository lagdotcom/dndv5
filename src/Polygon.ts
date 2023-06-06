import Point from "./types/Point";

type Line = [start: Point, end: Point];

export default class Polygon {
  lines: readonly Line[];

  constructor(public readonly points: Point[]) {
    const lines: Line[] = [];
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[i];
      const b = points[j];

      lines.push([a, b]);
    }

    this.lines = lines;
  }

  containsPoint({ x, y }: Point) {
    let inside = false;

    // ray-casting algorithm based on https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    for (const line of this.lines) {
      const [a, b] = line;
      if (
        a.y > y != b.y > y &&
        x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x
      )
        inside = !inside;
    }

    return inside;
  }
}
