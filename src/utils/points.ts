import MoveDirection from "../types/MoveDirection";
import Point from "../types/Point";

export const _p = (x: number, y: number): Point => ({ x, y });

export function addPoints(a: Point, b: Point) {
  return _p(a.x + b.x, a.y + b.y);
}

export function mulPoint(z: Point, mul: number) {
  return _p(z.x * mul, z.y * mul);
}

const moveOffsets: Record<MoveDirection, Point> = {
  east: _p(5, 0),
  southeast: _p(5, 5),
  south: _p(0, 5),
  southwest: _p(-5, 5),
  west: _p(-5, 0),
  northwest: _p(-5, -5),
  north: _p(0, -5),
  northeast: _p(5, -5),
};

export function movePoint(p: Point, d: MoveDirection) {
  return addPoints(p, moveOffsets[d]);
}
