import AbstractCombatant from "../AbstractCombatant";
import Combatant from "../types/Combatant";

export function isDefined<T>(value?: T): value is T {
  return typeof value !== "undefined";
}

export function isA<T extends string>(
  value: string,
  enumeration: readonly T[]
): value is T {
  return enumeration.includes(value as T);
}

export function isCombatantArray(value: unknown): value is Combatant[] {
  if (!Array.isArray(value)) return false;
  for (const who of value)
    if (!(who instanceof AbstractCombatant)) return false;
  return true;
}
