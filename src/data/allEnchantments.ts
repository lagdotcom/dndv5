import adamantine from "../enchantments/adamantine";
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
import {
  acidResistance,
  coldResistance,
  fireResistance,
  forceResistance,
  lightningResistance,
  necroticResistance,
  poisonResistance,
  psychicResistance,
  radiantResistance,
  thunderResistance,
  vulnerabilityBludgeoning,
  vulnerabilityPiercing,
  vulnerabilitySlashing,
} from "../enchantments/resistantArmor";
import silvered from "../enchantments/silvered";
import { chaoticBurst, vicious } from "../enchantments/weapon";

const allEnchantments = {
  // armor
  adamantine,
  "+1 armor": armorPlus1,
  "+2 armor": armorPlus2,
  "+3 armor": armorPlus3,
  "acid resistance": acidResistance,
  "cold resistance": coldResistance,
  "fire resistance": fireResistance,
  "force resistance": forceResistance,
  "lightning resistance": lightningResistance,
  "necrotic resistance": necroticResistance,
  "poison resistance": poisonResistance,
  "psychic resistance": psychicResistance,
  "radiant resistance": radiantResistance,
  "thunder resistance": thunderResistance,
  "vulnerability (bludgeoning)": vulnerabilityBludgeoning,
  "vulnerability (piercing)": vulnerabilityPiercing,
  "vulnerability (slashing)": vulnerabilitySlashing,

  // weapon
  "+1 weapon": weaponPlus1,
  "+2 weapon": weaponPlus2,
  "+3 weapon": weaponPlus3,
  "chaotic burst": chaoticBurst,
  silvered,
  vicious,

  // homebrew
  "dark sun": darkSun,
  "of the deep": ofTheDeep,
} as const;
export default allEnchantments;

export type EnchantmentName = keyof typeof allEnchantments;
