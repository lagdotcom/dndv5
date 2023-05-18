import DamageAmount from "../types/DamageAmount";
import DamageType from "../types/DamageType";

export const dd = (
  count: number,
  size: number,
  damage: DamageType
): DamageAmount => ({
  type: "dice",
  amount: { count, size },
  damageType: damage,
});
