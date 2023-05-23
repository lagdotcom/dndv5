import { SpecifiedEffectShape } from "../types/EffectArea";
import Point from "../types/Point";

export function resolveArea(area: SpecifiedEffectShape) {
  const points: Point[] = [];

  switch (area.type) {
    case "sphere": {
      const left = area.centre.x - area.radius;
      const top = area.centre.y - area.radius;
      for (let y = 0; y <= area.radius * 2; y += 5) {
        const dy = y - area.radius + 2.5;

        for (let x = 0; x <= area.radius * 2; x += 5) {
          const dx = x - area.radius + 2.5;

          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= area.radius) points.push({ x: left + x, y: top + y });
        }
      }
    }
  }

  return points;
}
