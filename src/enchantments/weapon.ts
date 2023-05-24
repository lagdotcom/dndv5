import Engine from "../Engine";
import Enchantment from "../types/Enchantment";
import { WeaponItem } from "../types/Item";

export const vicious: Enchantment<"weapon"> = {
  name: "vicious",
  setup(g: Engine, item: WeaponItem) {
    item.name = "vicious " + item.name;

    g.events.on("gatherDamage", ({ detail: { weapon, bonus, attack } }) => {
      if (weapon === item && attack?.roll.value === 20) bonus.add(7, vicious);
    });
  },
};
