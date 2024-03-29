import { Feet } from "../flavours";
import { enumerateMapSquares, MapSquareSize } from "../MapSquare";
import PointSet from "../PointSet";
import Combatant from "../types/Combatant";
import Point from "../types/Point";
import SizeCategory from "../types/SizeCategory";

const categoryUnits: Record<SizeCategory, Feet> = {
  [SizeCategory.Tiny]: 1,
  [SizeCategory.Small]: 1,
  [SizeCategory.Medium]: 1,
  [SizeCategory.Large]: 2,
  [SizeCategory.Huge]: 3,
  [SizeCategory.Gargantuan]: 4,
};

export function convertSizeToUnit(size: SizeCategory): Feet {
  return categoryUnits[size] * MapSquareSize;
}

export function getDistanceBetween(
  { x: x1, y: y1 }: Point,
  size1: Feet,
  { x: x2, y: y2 }: Point,
  size2: Feet,
): Feet {
  // Calculate the closest points on the edges
  const closest_x1 = Math.max(x1, x2);
  const closest_x2 = Math.min(x1 + size1, x2 + size2);
  const closest_y1 = Math.max(y1, y2);
  const closest_y2 = Math.min(y1 + size1, y2 + size2);

  return (
    Math.max(closest_x1 - closest_x2, closest_y1 - closest_y2) + MapSquareSize
  );
}

export function distance(a: Combatant, b: Combatant) {
  return getDistanceBetween(
    a.position,
    a.sizeInUnits,
    b.position,
    b.sizeInUnits,
  );
}

export function distanceTo(who: Combatant, to: Point) {
  return getDistanceBetween(who.position, who.sizeInUnits, to, MapSquareSize);
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
