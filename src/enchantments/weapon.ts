import { TurnResource } from "../resources";
import DamageType from "../types/DamageType";
import Enchantment from "../types/Enchantment";
import { plus1 } from "./plus";

const ChaoticBurstResource = new TurnResource("Chaotic Burst", 1);
const chaoticBurstTypes: DamageType[] = [
  "acid",
  "cold",
  "fire",
  "force",
  "lightning",
  "poison",
  "psychic",
  "thunder",
];
export const chaoticBurst: Enchantment<"weapon"> = {
  name: "chaotic burst",
  setup(g, item) {
    plus1.setup(g, item);
    item.name = `chaotic burst ${item.weaponType}`;

    // TODO The first time you critically hit each turn while attuned to this weapon a chaos bolt fires from it, dealing an additional 2d8 damage. Choose one of the d8s. The number rolled on that die determines the attack’s damage type.
    console.warn("[Enchantment Missing] Chaotic Burst");
  },
};

export const vicious: Enchantment<"weapon"> = {
  name: "vicious",
  setup(g, item) {
    item.name = `vicious ${item.name}`;

    g.events.on("gatherDamage", ({ detail: { weapon, bonus, attack } }) => {
      if (weapon === item && attack?.roll.value === 20) bonus.add(7, vicious);
    });
  },
};
