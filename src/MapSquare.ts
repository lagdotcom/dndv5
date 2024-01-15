import { Feet } from "./flavours";
import Polygon from "./Polygon";
import Point from "./types/Point";
import { getBoundingBox } from "./utils/areas";
import { round, roundUp } from "./utils/numbers";

export const MapSquareSize: Feet = 5;
export const HalfSquareSize = MapSquareSize / 2;

export default class MapSquare extends Polygon {
  constructor(
    public x: Feet,
    public y: Feet,
  ) {
    super([
      { x, y },
      { x: x + MapSquareSize, y },
      { x: x + MapSquareSize, y: y + MapSquareSize },
      { x, y: y + MapSquareSize },
    ]);
  }

  getTopLeft(): Point {
    return { x: this.x, y: this.y };
  }

  getMiddle(): Point {
    return { x: this.x + HalfSquareSize, y: this.y + HalfSquareSize };
  }
}

export function* enumerateMapSquares(
  minX: Feet,
  minY: Feet,
  maxX: Feet,
  maxY: Feet,
) {
  for (let y = minY; y < maxY; y += MapSquareSize)
    for (let x = minX; x < maxX; x += MapSquareSize) yield new MapSquare(x, y);
}

export function getAllMapSquaresContainingPolygon(poly: Polygon) {
  const box = getBoundingBox(poly.points);
  const minX = round(box.x, MapSquareSize);
  const minY = round(box.y, MapSquareSize);
  const maxX = roundUp(box.x + box.w, MapSquareSize);
  const maxY = roundUp(box.y + box.h, MapSquareSize);

  return enumerateMapSquares(minX, minY, maxX, maxY);
}

export function getAllMapSquaresContainingCircle(centre: Point, radius: Feet) {
  const minX = round(centre.x - radius, MapSquareSize);
  const minY = round(centre.y - radius, MapSquareSize);
  const maxX = roundUp(centre.x + radius, MapSquareSize);
  const maxY = roundUp(centre.y + radius, MapSquareSize);

  return enumerateMapSquares(minX, minY, maxX, maxY);
}
