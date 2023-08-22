import DamageAmount from "../types/DamageAmount";
import DamageType from "../types/DamageType";
import { getDiceAverage } from "./dnd";

export const _dd = (
  count: number,
  size: number,
  damage: DamageType,
): DamageAmount => ({
  type: "dice",
  amount: { count, size },
  damageType: damage,
});

export function getDefaultHPRoll(level: number, hitDieSize: number) {
  if (level === 1) return hitDieSize;
  return Math.ceil(getDiceAverage(1, hitDieSize));
}
