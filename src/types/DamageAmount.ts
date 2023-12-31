import { DiceAmount, FlatAmount } from "./Amount";
import DamageType from "./DamageType";

export type FlatDamage = FlatAmount & { damageType: DamageType };
export type DiceDamage = DiceAmount & { damageType: DamageType };

type DamageAmount = FlatDamage | DiceDamage;
export default DamageAmount;
