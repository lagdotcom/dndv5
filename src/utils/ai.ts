import EvaluationCollector from "../collectors/EvaluationCollector";
import DefaultingMap from "../DefaultingMap";
import Engine from "../Engine";
import { Feet } from "../flavours";
import { MapSquareSize } from "../MapSquare";
import PointSet from "../PointSet";
import { ActionEvaluation, PositionConstraint } from "../types/AIRule";
import Combatant from "../types/Combatant";
import Point from "../types/Point";
import { checkConfig } from "./config";
import { getDistanceBetween } from "./units";

export const poSet = (...constraints: PositionConstraint[]) =>
  new Set(constraints);

export const poWithin = (range: Feet, of: Combatant): PositionConstraint => ({
  type: "within",
  range,
  of,
});

function matchesAll(
  g: Engine,
  point: Point,
  size: Feet,
  po: Iterable<PositionConstraint>,
) {
  for (const co of po) {
    if (co.type === "within") {
      const d = getDistanceBetween(
        point,
        size,
        co.of.position,
        co.of.sizeInUnits,
      );
      if (d > co.range) return false;
    }
  }

  return true;
}

export function getAllPoints(
  g: Engine,
  me: Combatant,
  constraints: PositionConstraint[],
) {
  if (constraints.length < 1) throw new Error("No constraints");

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const co of constraints) {
    if (co.type === "within") {
      minX = Math.min(minX, co.of.position.x - co.range);
      minY = Math.min(minY, co.of.position.y - co.range);
      maxX = Math.max(maxX, co.of.position.x + co.of.sizeInUnits + co.range);
      maxY = Math.max(maxY, co.of.position.y + co.of.sizeInUnits + co.range);
    }
  }

  const points = new PointSet();
  for (let y = minY; y <= maxY; y += MapSquareSize)
    for (let x = minX; x <= maxX; x += MapSquareSize) {
      const point = { x, y };
      if (matchesAll(g, point, me.sizeInUnits, constraints)) points.add(point);
    }

  return points;
}

export type CompleteEvaluation = ActionEvaluation & {
  positionMap: Map<number, PointSet>;
  best: number;
  bestPositions: PointSet;
  bestScore: EvaluationCollector;
};

export function* getAllEvaluations(
  g: Engine,
  me: Combatant,
): Generator<CompleteEvaluation> {
  const actions = g.getActions(me);
  const original = me.position;
  const positions = getAllPoints(g, me, [
    poWithin(me.speed - me.movedSoFar, me),
  ]);

  for (const rule of me.rules) {
    if (!rule.evaluateActions) continue;

    const v = rule.evaluateActions(g, me, actions);
    for (const o of v) {
      const positionMap = new DefaultingMap<number, PointSet>(
        () => new PointSet(),
      );
      let best = -Infinity;
      let bestScore: EvaluationCollector | undefined;

      for (const position of positions) {
        if (!matchesAll(g, position, me.sizeInUnits, o.positioning)) continue;

        me.position = position;
        if (
          !checkConfig(g, o.action, o.config) ||
          o.action.getTime(o.config) === "reaction"
        )
          continue;

        const score = o.score.copy();
        for (const rule of me.rules) {
          if (!rule.evaluatePosition) continue;
          rule.evaluatePosition(g, me, score, position);
        }

        const total = score.result;
        positionMap.get(total).add(position);

        if (total > best) {
          best = total;
          bestScore = score;
        }
      }

      const bestPositions = positionMap.get(best);
      if (bestPositions && bestScore)
        yield {
          ...o,
          positionMap,
          best,
          bestPositions,
          bestScore,
        };
    }
  }

  me.position = original;
}
