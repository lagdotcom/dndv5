import { MapSquareSize } from "../MapSquare";
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
  east: _p(MapSquareSize, 0),
  southeast: _p(MapSquareSize, MapSquareSize),
  south: _p(0, MapSquareSize),
  southwest: _p(-MapSquareSize, MapSquareSize),
  west: _p(-MapSquareSize, 0),
  northwest: _p(-MapSquareSize, -MapSquareSize),
  north: _p(0, -MapSquareSize),
  northeast: _p(MapSquareSize, -MapSquareSize),
};

export function movePoint(p: Point, d: MoveDirection) {
  return addPoints(p, moveOffsets[d]);
}
