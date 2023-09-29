import {
  getAllMapSquaresContainingCircle,
  getAllMapSquaresContainingPolygon,
} from "../MapSquare";
import PointSet from "../PointSet";
import Polygon from "../Polygon";
import { SpecifiedEffectShape } from "../types/EffectArea";
import Point from "../types/Point";

function resolvePolygon(points: Point[]) {
  const poly = new Polygon(points);

  const set = new PointSet();
  for (const square of getAllMapSquaresContainingPolygon(poly)) {
    if (poly.containsPoint(square.getMiddle())) set.add(square.getTopLeft());
  }

  return set;
}

export function getBoundingBox(points: Iterable<Point>) {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (const { x, y } of points) {
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }

  return { x: left, y: top, w: right - left, h: bottom - top };
}

export function getTilesWithinCircle(centre: Point, radius: number) {
  const set = new PointSet();
  for (const square of getAllMapSquaresContainingCircle(centre, radius)) {
    const midpoint = square.getMiddle();
    const dx = midpoint.x - centre.x;
    const dy = midpoint.y - centre.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= radius) set.add(square.getTopLeft());
  }

  return set;
}

export function getRectangleAsPolygon(
  { x, y }: Point,
  width: number,
  height: number,
): Point[] {
  return [
    { x: x, y: y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ];
}

export function getTilesWithinRectangle(
  topLeft: Point,
  width: number,
  height: number,
) {
  return resolvePolygon(getRectangleAsPolygon(topLeft, width, height));
}

export function getLineAsPolygon(
  { x: sx, y: sy }: Point,
  { x: tx, y: ty }: Point,
  width: number,
  length: number,
): Point[] {
  const dir = Math.atan2(ty - sy, tx - sx);
  const off = dir - Math.PI / 2;

  const xd = length * Math.cos(dir);
  const yd = length * Math.sin(dir);

  const w2 = width / 2;
  const xo = w2 * Math.cos(off);
  const yo = w2 * Math.sin(off);
  const ax = sx + xo;
  const ay = sy + yo;
  const bx = sx - xo;
  const by = sy - yo;
  const cx = bx + xd;
  const cy = by + yd;
  const dx = ax + xd;
  const dy = ay + yd;

  return [
    { x: ax, y: ay },
    { x: bx, y: by },
    { x: cx, y: cy },
    { x: dx, y: dy },
  ];
}

export function getTilesWithinLine(
  start: Point,
  end: Point,
  width: number,
  length: number,
) {
  return resolvePolygon(getLineAsPolygon(start, end, width, length));
}

export function getConeAsPolygon(
  { x: sx, y: sy }: Point,
  { x: tx, y: ty }: Point,
  radius: number,
): Point[] {
  const dir = Math.atan2(ty - sy, tx - sx);
  const off = dir - Math.PI / 2;

  const xd = radius * Math.cos(dir);
  const yd = radius * Math.sin(dir);

  const w2 = radius / 2;
  const xo = w2 * Math.cos(off);
  const yo = w2 * Math.sin(off);
  const ax = sx + xd + xo;
  const ay = sy + yd + yo;
  const bx = sx + xd - xo;
  const by = sy + yd - yo;

  return [
    { x: sx, y: sy },
    { x: ax, y: ay },
    { x: bx, y: by },
  ];
}

export function getTilesWithinCone(start: Point, end: Point, radius: number) {
  return resolvePolygon(getConeAsPolygon(start, end, radius));
}

export function resolveArea(area: SpecifiedEffectShape) {
  switch (area.type) {
    case "cylinder": // TODO [HEIGHT]
    case "sphere":
      return getTilesWithinCircle(area.centre, area.radius);

    case "within": {
      const x = area.position.x - area.radius;
      const y = area.position.y - area.radius;
      const size = area.target.sizeInUnits + area.radius * 2;
      return getTilesWithinRectangle({ x, y }, size, size);
    }

    case "cube": {
      const x = area.centre.x - area.length / 2;
      const y = area.centre.y - area.length / 2;
      const size = area.length;
      return getTilesWithinRectangle({ x, y }, size, size);
    }

    case "cone":
      return getTilesWithinCone(area.centre, area.target, area.radius);

    case "line":
      return getTilesWithinLine(
        area.start,
        area.target,
        area.width,
        area.length,
      );
  }
}
