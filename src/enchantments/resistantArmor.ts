import {
  MagicDamageType,
  MundaneDamageType,
  MundaneDamageTypes,
} from "../types/DamageType";
import Enchantment from "../types/Enchantment";
import { isEquipmentAttuned } from "../utils/items";
import { isA } from "../utils/types";

const resistanceTo = (type: MagicDamageType): Enchantment<"armor"> => ({
  name: `${type} resistance`,
  setup(g, item) {
    item.name = `${item.name} of resistance to ${type}`;
    item.rarity = "Rare";
    item.attunement = true;

    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (isEquipmentAttuned(item, who) && damageType === type)
          response.add("resist", this);
      },
    );
  },
});
export const acidResistance = resistanceTo("acid");
export const coldResistance = resistanceTo("cold");
export const fireResistance = resistanceTo("fire");
export const forceResistance = resistanceTo("force");
export const lightningResistance = resistanceTo("lightning");
export const necroticResistance = resistanceTo("necrotic");
export const poisonResistance = resistanceTo("poison");
export const psychicResistance = resistanceTo("psychic");
export const radiantResistance = resistanceTo("radiant");
export const thunderResistance = resistanceTo("thunder");

const vulnerability = (type: MundaneDamageType): Enchantment<"armor"> => ({
  name: `vulnerability (${type})`,
  setup(g, item) {
    item.name = `${item.name} of vulnerability (${type})`;
    item.rarity = "Rare";
    item.attunement = true;

    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (
          isEquipmentAttuned(item, who) &&
          isA(damageType, MundaneDamageTypes)
        )
          response.add(damageType === type ? "resist" : "vulnerable", this);
      },
    );
  },
});
export const vulnerabilityBludgeoning = vulnerability("bludgeoning");
export const vulnerabilityPiercing = vulnerability("piercing");
export const vulnerabilitySlashing = vulnerability("slashing");
