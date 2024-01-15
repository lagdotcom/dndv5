import { Feet } from "../flavours";
import { MapSquareSize } from "../MapSquare";
import MoveDirection from "../types/MoveDirection";
import Point from "../types/Point";

export const _p = (x: Feet, y: Feet): Point => ({ x, y });

export function addPoints(a: Point, b: Point) {
  return _p(a.x + b.x, a.y + b.y);
}

export function mulPoint(z: Point, mul: number) {
  return _p(z.x * mul, z.y * mul);
}

export function subPoints(a: Point, b: Point) {
  return _p(a.x - b.x, a.y - b.y);
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

// https://www.redblobgames.com/grids/line-drawing/#supercover
function supercoverLine(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const nx = Math.abs(dx);
  const ny = Math.abs(dy);
  const moveX = dx > 0 ? MapSquareSize : -MapSquareSize;
  const moveY = dy > 0 ? MapSquareSize : -MapSquareSize;

  const p = _p(a.x, a.y);
  const points = [_p(p.x, p.y)];
  for (let ix = 0, iy = 0; ix < nx || iy < ny; ) {
    const decision = (1 + 2 * ix) * ny - (1 + 2 * iy) * nx;
    if (decision === 0) {
      // next step is diagonal
      p.x += moveX;
      p.y += moveY;
      ix += MapSquareSize;
      iy += MapSquareSize;
    } else if (decision < 0) {
      // next step is horizontal
      p.x += moveX;
      ix += MapSquareSize;
    } else {
      // next step is vertical
      p.y += moveY;
      iy += MapSquareSize;
    }
    points.push(_p(p.x, p.y));
  }
  return points;
}

export function getPathAwayFrom(p: Point, away: Point, dist: Feet) {
  const dy = p.y - away.y;
  const dx = p.x - away.x;
  const angle = Math.atan2(dy, dx);

  const mx = dist * Math.cos(angle);
  const my = dist * Math.sin(angle);

  return supercoverLine(
    p,
    _p(Math.floor(p.x + mx), Math.floor(p.y + my)),
  ).slice(1);
}
