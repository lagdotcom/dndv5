import { PositionConstraint } from "../types/AIRule";
import Combatant from "../types/Combatant";

export const poSet = (...constraints: PositionConstraint[]) =>
  new Set(constraints);

export const poWithin = (range: number, of: Combatant): PositionConstraint => ({
  type: "within",
  range,
  of,
});
