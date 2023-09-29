import Engine from "../Engine";
import { EventListener } from "../events/Dispatcher";
import Enchantment from "../types/Enchantment";
import { AmmoItem, ItemRarity, WeaponItem } from "../types/Item";
import Source from "../types/Source";

export function getWeaponPlusHandler(
  item: WeaponItem | AmmoItem,
  value: number,
  source: Source,
): EventListener<"BeforeAttack" | "GatherDamage"> {
  return ({ detail: { weapon, ammo, bonus } }) => {
    if (weapon === item || ammo === item) bonus.add(value, source);
  };
}

const weaponPlus = (
  value: number,
  rarity: ItemRarity,
): Enchantment<"weapon" | "ammo"> => ({
  name: `+${value} bonus`,
  setup(g: Engine, item) {
    item.name = `${item.name} +${value}`;
    item.magical = true;
    item.rarity = rarity;

    const handler = getWeaponPlusHandler(item, value, this);
    g.events.on("BeforeAttack", handler);
    g.events.on("GatherDamage", handler);
  },
});

export const weaponPlus1 = weaponPlus(1, "Uncommon");
export const weaponPlus2 = weaponPlus(2, "Rare");
export const weaponPlus3 = weaponPlus(3, "Very Rare");

const armorPlus = (
  value: number,
  rarity: ItemRarity,
): Enchantment<"armor"> => ({
  name: `+${value} bonus`,
  setup(g: Engine, item) {
    item.name = `${item.name} +${value}`;
    item.magical = true;
    item.rarity = rarity;

    item.ac += value;
  },
});

export const armorPlus1 = armorPlus(1, "Rare");
export const armorPlus2 = armorPlus(2, "Very Rare");
export const armorPlus3 = armorPlus(3, "Legendary");
