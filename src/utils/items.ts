import Ability from "../types/Ability";
import Combatant from "../types/Combatant";
import Item, { ArmorItem, WeaponItem } from "../types/Item";
import isDefined from "./isDefined";

export const isSuitOfArmor = (item: Item): item is ArmorItem =>
  item.itemType === "armor" && item.category !== "shield";

export const isShield = (item: Item): item is ArmorItem =>
  item.itemType === "armor" && item.category === "shield";

export function getWeaponAbility(who: Combatant, weapon: WeaponItem): Ability {
  if (weapon.forceAbilityScore) return weapon.forceAbilityScore;

  const { str, dex } = who;

  if (weapon.properties.has("finesse")) {
    if (dex >= str) return "dex";
  }

  if (weapon.rangeCategory === "ranged") return "dex";

  // TODO thrown

  return "str";
}

export function getWeaponRange(who: Combatant, weapon: WeaponItem) {
  if (isDefined(weapon.longRange)) return weapon.longRange;
  return who.reach;
}
