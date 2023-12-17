import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import Item, { ArmorItem, WeaponItem } from "../types/Item";
import { isDefined } from "./types";

export const isSuitOfArmor = (item: Item): item is ArmorItem =>
  item.itemType === "armor" && item.category !== "shield";

export const isShield = (item: Item): item is ArmorItem =>
  item.itemType === "armor" && item.category === "shield";

export function getWeaponAbility(
  who: Combatant,
  weapon: WeaponItem,
): AbilityName {
  if (weapon.forceAbilityScore) return weapon.forceAbilityScore;

  const { str, dex } = who;

  // TODO should really be a choice
  if (weapon.properties.has("finesse") && dex.score >= str.score) return "dex";

  if (weapon.rangeCategory === "ranged") return "dex";

  return "str";
}

export function getWeaponRange(who: Combatant, weapon: WeaponItem) {
  if (isDefined(weapon.longRange)) return weapon.longRange;
  return who.reach + weapon.reach;
}

export function getValidAmmunition(who: Combatant, weapon: WeaponItem) {
  return who.ammunition.filter(
    (ammo) => ammo.ammunitionTag === weapon.ammunitionTag,
  );
}

export function isEquipmentAttuned(
  item: Item,
  who?: Combatant,
): who is Combatant {
  return who?.equipment.has(item) === true && who.attunements.has(item);
}
