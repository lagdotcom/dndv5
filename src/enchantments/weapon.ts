import PickFromListChoice, {
  PickChoice,
} from "../interruptions/PickFromListChoice";
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

const getOptionFromRoll = (roll: number): PickChoice<DamageType> => {
  const value = chaoticBurstTypes[roll - 1];
  return { label: value, value };
};

export const chaoticBurst: Enchantment<"weapon"> = {
  name: "chaotic burst",
  setup(g, item) {
    plus1.setup(g, item);
    item.name = `chaotic burst ${item.weaponType}`;

    g.events.on("turnStarted", ({ detail: { who } }) => {
      if (who.equipment.has(item) && who.attunements.has(item))
        who.addResource(ChaoticBurstResource);
    });

    g.events.on(
      "gatherDamage",
      ({ detail: { attacker, critical, interrupt, map } }) => {
        if (
          critical &&
          attacker.equipment.has(item) &&
          attacker.attunements.has(item) &&
          attacker.hasResource(ChaoticBurstResource)
        ) {
          attacker.spendResource(ChaoticBurstResource);

          const a = g.dice.roll(
            { type: "damage", attacker, size: 8 },
            "normal"
          ).value;
          const b = g.dice.roll(
            { type: "damage", attacker, size: 8 },
            "normal"
          ).value;
          const addBurst = (type: DamageType) => map.add(type, a + b);

          if (a === b) addBurst(chaoticBurstTypes[a - 1]);
          else
            interrupt.add(
              new PickFromListChoice(
                attacker,
                chaoticBurst,
                "Chaotic Burst",
                "Choose the damage type:",
                [a, b].map(getOptionFromRoll),
                async (type) => addBurst(type)
              )
            );
        }
      }
    );
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
