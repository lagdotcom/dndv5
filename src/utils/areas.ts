import { SpecifiedEffectShape } from "../types/EffectArea";
import Point from "../types/Point";

export function resolveArea(area: SpecifiedEffectShape): Point[] {
  const points: Point[] = [];

  switch (area.type) {
    case "cylinder": // TODO once height exists
    case "sphere": {
      const left = area.centre.x - area.radius;
      const top = area.centre.y - area.radius;
      const size = area.radius * 2;
      for (let y = 0; y <= size; y += 5) {
        const dy = y - area.radius + 2.5;

        for (let x = 0; x <= size; x += 5) {
          const dx = x - area.radius + 2.5;

          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= area.radius) points.push({ x: left + x, y: top + y });
        }
      }
      break;
    }

    case "within": {
      const left = area.position.x - area.radius;
      const top = area.position.y - area.radius;
      const size = area.target.sizeInUnits + area.radius;
      for (let y = 0; y <= size; y += 5) {
        for (let x = 0; x <= size; x += 5) {
          points.push({ x: left + x, y: top + y });
        }
      }
      break;
    }
  }

  // TODO: cone, line
  return points;
}
