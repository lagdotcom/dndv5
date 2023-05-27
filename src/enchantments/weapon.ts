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

    // TODO Choose one of the d8s. The number rolled on that die determines the attack’s damage type.
    console.warn("[Enchantment Not Finished] Chaotic Burst");

    g.events.on("turnStarted", ({ detail: { who } }) => {
      if (who.equipment.has(item) && who.attunements.has(item))
        who.addResource(ChaoticBurstResource);
    });

    g.events.on("gatherDamage", ({ detail: { attacker, bonus, critical } }) => {
      if (
        critical &&
        attacker.equipment.has(item) &&
        attacker.attunements.has(item) &&
        attacker.hasResource(ChaoticBurstResource)
      ) {
        attacker.spendResource(ChaoticBurstResource);

        const a = g.dice.roll({ type: "damage", attacker, size: 8 }, "normal");
        const b = g.dice.roll({ type: "damage", attacker, size: 8 }, "normal");

        const total = a.value + b.value;
        bonus.add(total, chaoticBurst);
      }
    });
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
