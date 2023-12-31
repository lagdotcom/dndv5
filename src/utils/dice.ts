import { DiceDamage, FlatDamage } from "../types/DamageAmount";
import DamageType from "../types/DamageType";
import { getDiceAverage } from "./dnd";

export const _fd = (amount: number, damageType: DamageType): FlatDamage => ({
  type: "flat",
  amount,
  damageType,
});

export const _dd = (
  count: number,
  size: number,
  damageType: DamageType,
): DiceDamage => ({ type: "dice", amount: { count, size }, damageType });

export function getDefaultHPRoll(level: number, hitDieSize: number) {
  if (level === 1) return hitDieSize;
  return Math.ceil(getDiceAverage(1, hitDieSize));
}
