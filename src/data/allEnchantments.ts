import darkSun from "../enchantments/darkSun";
import ofTheDeep from "../enchantments/ofTheDeep";
import {
  armorPlus1,
  armorPlus2,
  armorPlus3,
  weaponPlus1,
  weaponPlus2,
  weaponPlus3,
} from "../enchantments/plus";
import silvered from "../enchantments/silvered";
import { chaoticBurst, vicious } from "../enchantments/weapon";

const allEnchantments = {
  "dark sun": darkSun,
  "of the deep": ofTheDeep,
  "+1 armor": armorPlus1,
  "+2 armor": armorPlus2,
  "+3 armor": armorPlus3,
  "+1 weapon": weaponPlus1,
  "+2 weapon": weaponPlus2,
  "+3 weapon": weaponPlus3,
  silvered,
  "chaotic burst": chaoticBurst,
  vicious,
} as const;
export default allEnchantments;

export type EnchantmentName = keyof typeof allEnchantments;
