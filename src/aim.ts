import { SpecifiedEffectShape } from "./types/EffectArea";
import Point from "./types/Point";

function addPoints(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

function mulPoint(p: Point, mul: number): Point {
  return { x: p.x * mul, y: p.y * mul };
}

const eighth = Math.PI / 4;
const eighthOffset = eighth / 2;

const octant1 = eighthOffset;
const octant2 = octant1 + eighth;
const octant3 = octant2 + eighth;
const octant4 = octant3 + eighth;
const octant5 = octant4 + eighth;
const octant6 = octant5 + eighth;
const octant7 = octant6 + eighth;
const octant8 = octant7 + eighth;

export function getAimOffset(a: Point, b: Point): Point {
  let angle = Math.atan2(b.y - a.y, b.x - a.x);
  if (angle < 0) angle += Math.PI * 2;

  if (angle < octant1) return { x: 1, y: 0.5 };
  else if (angle < octant2) return { x: 1, y: 1 };
  else if (angle < octant3) return { x: 0.5, y: 1 };
  else if (angle < octant4) return { x: 0, y: 1 };
  else if (angle < octant5) return { x: 0, y: 0.5 };
  else if (angle < octant6) return { x: 0, y: 0 };
  else if (angle < octant7) return { x: 0.5, y: 0 };
  else if (angle < octant8) return { x: 1, y: 0 };
  return { x: 1, y: 0.5 };
}

export function aimCone(
  position: Point,
  size: number,
  aim: Point,
  radius: number
): SpecifiedEffectShape {
  const offset = getAimOffset(position, aim);

  return {
    type: "cone",
    radius,
    centre: addPoints(position, mulPoint(offset, size)),
    target: addPoints(aim, mulPoint(offset, 5)),
  };
}

export function aimLine(
  position: Point,
  size: number,
  aim: Point,
  length: number,
  width: number
): SpecifiedEffectShape {
  const offset = getAimOffset(position, aim);

  return {
    type: "line",
    length,
    width,
    start: addPoints(position, mulPoint(offset, size)),
    target: addPoints(aim, mulPoint(offset, 5)),
  };
}
