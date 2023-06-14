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
  posA: Point,
  sizeA: number,
  posB: Point,
  sizeB: number
) {
  // TODO [SIZE] unit sizes
  const dx = Math.abs(posA.x - posB.x);
  const dy = Math.abs(posA.y - posB.y);
  return Math.max(dx, dy);
}

export function distance(g: Engine, a: Combatant, b: Combatant) {
  const as = g.getState(a);
  const bs = g.getState(b);

  return getDistanceBetween(
    as.position,
    a.sizeInUnits,
    bs.position,
    b.sizeInUnits
  );
}

export function distanceTo(g: Engine, who: Combatant, to: Point) {
  const s = g.getState(who);

  return getDistanceBetween(s.position, who.sizeInUnits, to, MapSquareSize);
}

export function getSquares(who: Combatant, position: Point) {
  return new PointSet(
    enumerateMapSquares(
      position.x,
      position.y,
      position.x + who.sizeInUnits,
      position.y + who.sizeInUnits
    )
  );
}
