import CombatantBase from "../CombatantBase";
import Combatant from "../types/Combatant";
import Point from "../types/Point";

export function isDefined<T>(value?: T): value is T {
  return typeof value !== "undefined";
}

export function isA<T extends string>(
  value: string | undefined,
  enumeration: readonly T[],
): value is T {
  return enumeration.includes(value as T);
}

export function isCombatantArray(value: unknown): value is Combatant[] {
  if (!Array.isArray(value)) return false;
  for (const who of value) if (!(who instanceof CombatantBase)) return false;
  return true;
}

export function isPoint(value: unknown): value is Point {
  return (
    typeof value === "object" &&
    typeof (value as Point).x === "number" &&
    typeof (value as Point).y === "number"
  );
}

export function isPointArray(value: unknown): value is Point[] {
  if (!Array.isArray(value)) return false;
  for (const point of value) if (!isPoint(point)) return false;
  return true;
}
