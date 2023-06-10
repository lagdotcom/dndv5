import Engine from "../Engine";
import { enumerateMapSquares } from "../MapSquare";
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
  return categoryUnits[size] * 5;
}

export function distance(g: Engine, a: Combatant, b: Combatant) {
  const as = g.getState(a);
  const bs = g.getState(b);

  // TODO [SIZE] unit sizes
  const dx = Math.abs(as.position.x - bs.position.x);
  const dy = Math.abs(as.position.y - bs.position.y);
  return Math.max(dx, dy);
}

export function distanceTo(g: Engine, who: Combatant, to: Point) {
  const s = g.getState(who);

  // TODO [SIZE] unit sizes
  const dx = Math.abs(s.position.x - to.x);
  const dy = Math.abs(s.position.y - to.y);
  return Math.max(dx, dy);
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
