import Engine from "../Engine";
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

  // TODO unit sizes
  const dx = Math.abs(as.position.x - bs.position.x);
  const dy = Math.abs(as.position.y - bs.position.y);
  return Math.max(dx, dy);
}

export function distanceTo(g: Engine, who: Combatant, to: Point) {
  const s = g.getState(who);

  // TODO unit sizes
  const dx = Math.abs(s.position.x - to.x);
  const dy = Math.abs(s.position.y - to.y);
  return Math.max(dx, dy);
}

export function getSquares(who: Combatant, position: Point) {
  const size = who.sizeInUnits;

  const points: Point[] = [];
  for (let y = 0; y < size; y += 5)
    for (let x = 0; x < size; x += 5)
      points.push({ x: x + position.x, y: y + position.y });

  return points;
}
