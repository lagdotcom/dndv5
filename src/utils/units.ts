import Engine from "../Engine";
import { enumerateMapSquares, MapSquareSize } from "../MapSquare";
import PointSet from "../PointSet";
import Combatant from "../types/Combatant";
import Point from "../types/Point";
import SizeCategory from "../types/SizeCategory";

const categoryUnits: Record<SizeCategory, number> = {
  tiny: 1,
  small: 1,
  medium: 1,
  large: 2,
  huge: 3,
  gargantuan: 4,
};

export function convertSizeToUnit(size: SizeCategory) {
  return categoryUnits[size] * MapSquareSize;
}

export function getDistanceBetween(
  { x: x1, y: y1 }: Point,
  size1: number,
  { x: x2, y: y2 }: Point,
  size2: number,
) {
  // Calculate the closest points on the edges
  const closest_x1: number = Math.max(x1, x2);
  const closest_x2: number = Math.min(x1 + size1, x2 + size2);
  const closest_y1: number = Math.max(y1, y2);
  const closest_y2: number = Math.min(y1 + size1, y2 + size2);

  return (
    Math.max(closest_x1 - closest_x2, closest_y1 - closest_y2) + MapSquareSize
  );
}

export function distance(g: Engine, a: Combatant, b: Combatant) {
  const as = g.getState(a);
  const bs = g.getState(b);

  return getDistanceBetween(
    as.position,
    a.sizeInUnits,
    bs.position,
    b.sizeInUnits,
  );
}

export function distanceTo(g: Engine, who: Combatant, to: Point) {
  const s = g.getState(who);

  return getDistanceBetween(s.position, who.sizeInUnits, to, MapSquareSize);
}

export function compareDistances(
  stationary: Combatant,
  stationaryPosition: Point,
  mover: Combatant,
  oldPosition: Point,
  newPosition: Point,
) {
  const oldDistance = getDistanceBetween(
    oldPosition,
    mover.sizeInUnits,
    stationaryPosition,
    stationary.sizeInUnits,
  );
  const newDistance = getDistanceBetween(
    newPosition,
    mover.sizeInUnits,
    stationaryPosition,
    stationary.sizeInUnits,
  );
  return { oldDistance, newDistance };
}

export function getSquares(who: Combatant, position: Point) {
  return new PointSet(
    enumerateMapSquares(
      position.x,
      position.y,
      position.x + who.sizeInUnits,
      position.y + who.sizeInUnits,
    ),
  );
}
