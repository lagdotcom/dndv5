import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import Enchantment from "../types/Enchantment";
import Item, {
  ArmorItem,
  ItemByTypeKey,
  ItemType,
  WeaponItem,
} from "../types/Item";
import { isDefined } from "./types";

export const isSuitOfArmor = (item: Item): item is ArmorItem =>
  item.itemType === "armor" && item.category !== "shield";

export const isShield = (item: Item): item is ArmorItem =>
  item.itemType === "armor" && item.category === "shield";

export function getWeaponAbility(
  who: Combatant,
  weapon: WeaponItem
): AbilityName {
  if (weapon.forceAbilityScore) return weapon.forceAbilityScore;

  const { str, dex } = who;

  // TODO should really be a choice
  if (weapon.properties.has("finesse") && dex.score >= str.score) return "dex";

  if (weapon.rangeCategory === "ranged") return "dex";

  // TODO thrown

  return "str";
}

export function getWeaponRange(who: Combatant, weapon: WeaponItem) {
  if (isDefined(weapon.longRange)) return weapon.longRange;
  return who.reach;
}

export function getValidAmmunition(who: Combatant, weapon: WeaponItem) {
  return who.ammunition.filter(
    (ammo) => ammo.ammunitionTag === weapon.ammunitionTag && ammo.quantity > 0
  );
}

export function enchant<T extends ItemType>(
  item: ItemByTypeKey[T],
  ...enchantments: Enchantment<T>[]
) {
  for (const enchantment of enchantments)
    item.addEnchantment(enchantment as Enchantment<never>);
  return item;
}
