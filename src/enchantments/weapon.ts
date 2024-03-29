import { ItemRarityColours } from "../colours";
import { DiceRoll } from "../flavours";
import PickFromListChoice, {
  makeStringChoice,
} from "../interruptions/PickFromListChoice";
import { TurnResource } from "../resources";
import { atSet } from "../types/AttackTag";
import DamageType from "../types/DamageType";
import Enchantment from "../types/Enchantment";
import Priority from "../types/Priority";
import { isEquipmentAttuned } from "../utils/items";
import { weaponPlus1 } from "./plus";

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

const getOptionFromRoll = (roll: DiceRoll) =>
  makeStringChoice<DamageType>(chaoticBurstTypes[roll - 1]);

export const chaoticBurst: Enchantment<"weapon"> = {
  name: "chaotic burst",
  setup(g, item) {
    weaponPlus1.setup(g, item);
    item.name = `chaotic burst ${item.weaponType}`;
    item.attunement = true;
    item.rarity = "Rare";
    if (item.icon) item.icon.colour = ItemRarityColours.Rare;

    g.events.on("TurnStarted", ({ detail: { who } }) => {
      if (isEquipmentAttuned(item, who)) who.initResource(ChaoticBurstResource);
    });

    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, critical, interrupt, map } }) => {
        if (
          critical &&
          isEquipmentAttuned(item, attacker) &&
          attacker.hasResource(ChaoticBurstResource)
        ) {
          attacker.spendResource(ChaoticBurstResource);

          const a = g.dice.roll({
            source: chaoticBurst,
            type: "damage",
            attacker,
            size: 8,
            tags: atSet("magical"),
          }).values.final;
          const b = g.dice.roll({
            source: chaoticBurst,
            type: "damage",
            attacker,
            size: 8,
            tags: atSet("magical"),
          }).values.final;
          const addBurst = (type: DamageType) => map.add(type, a + b);

          if (a === b) addBurst(chaoticBurstTypes[a - 1]);
          else
            interrupt.add(
              new PickFromListChoice(
                attacker,
                chaoticBurst,
                "Chaotic Burst",
                "Choose the damage type:",
                Priority.Normal,
                [a, b].map(getOptionFromRoll),
                async (type) => addBurst(type),
              ),
            );
        }
      },
    );
  },
};

export const vicious: Enchantment<"weapon"> = {
  name: "vicious",
  setup(g, item) {
    item.name = `vicious ${item.name}`;
    item.magical = true;
    item.rarity = "Rare";
    if (item.icon) item.icon.colour = ItemRarityColours.Rare;

    g.events.on("GatherDamage", ({ detail: { weapon, bonus, attack } }) => {
      if (weapon === item && attack?.roll.values.final === 20)
        bonus.add(7, vicious);
    });
  },
};
