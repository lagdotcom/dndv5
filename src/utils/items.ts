import Ability from "../types/Ability";
import Combatant from "../types/Combatant";
import Item, { WeaponItem } from "../types/Item";
import Predicate from "../types/Predicate";
import isDefined from "./isDefined";

export const isSuitOfArmor: Predicate<Item> = (item) =>
  item.itemType === "armor" && item.category !== "shield";

export const isShield: Predicate<Item> = (item) =>
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
