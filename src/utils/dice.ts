import { DiceCount, DiceSize, Modifier, PCLevel } from "../flavours";
import { DiceDamage, FlatDamage } from "../types/DamageAmount";
import DamageType from "../types/DamageType";
import { getDiceAverage } from "./dnd";

export const _fd = (amount: Modifier, damageType: DamageType): FlatDamage => ({
  type: "flat",
  amount,
  damageType,
});

export const _dd = (
  count: DiceCount,
  size: DiceSize,
  damageType: DamageType,
): DiceDamage => ({ type: "dice", amount: { count, size }, damageType });

export function getDefaultHPRoll(level: PCLevel, hitDieSize: DiceSize) {
  if (level === 1) return hitDieSize;
  return Math.ceil(getDiceAverage(1, hitDieSize));
}
