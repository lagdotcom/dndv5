import Engine from "../Engine";
import Enchantment from "../types/Enchantment";
import { AmmoItem, WeaponItem } from "../types/Item";

export const plus1: Enchantment<"weapon" | "ammo"> = {
  name: "+1 bonus",
  setup(g: Engine, item: WeaponItem | AmmoItem) {
    item.name += " +1";

    g.events.on("beforeAttack", ({ detail: { weapon, ammo, bonus } }) => {
      if (weapon === item || ammo === item) bonus.add(1, this);
    });

    g.events.on("gatherDamage", ({ detail: { weapon, ammo, bonus } }) => {
      if (weapon === item || ammo === item) bonus.add(1, this);
    });
  },
};
