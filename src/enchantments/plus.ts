import Engine from "../Engine";
import Enchantment from "../types/Enchantment";
import { AmmoItem, ItemRarity, WeaponItem } from "../types/Item";

const weaponPlus = (
  value: number,
  rarity: ItemRarity
): Enchantment<"weapon" | "ammo"> => ({
  name: `+${value} bonus`,
  setup(g: Engine, item: WeaponItem | AmmoItem) {
    item.name = `${item.name} +${value}`;
    item.magical = true;
    item.rarity = rarity;

    g.events.on("BeforeAttack", ({ detail: { weapon, ammo, bonus } }) => {
      if (weapon === item || ammo === item) bonus.add(value, this);
    });

    g.events.on("GatherDamage", ({ detail: { weapon, ammo, bonus } }) => {
      if (weapon === item || ammo === item) bonus.add(value, this);
    });
  },
});

export const weaponPlus1 = weaponPlus(1, "Uncommon");
export const weaponPlus2 = weaponPlus(2, "Rare");
export const weaponPlus3 = weaponPlus(3, "Very Rare");
