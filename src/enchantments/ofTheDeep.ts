import { ItemRarityColours } from "../colours";
import Enchantment from "../types/Enchantment";

const ofTheDeep: Enchantment<"weapon"> = {
  name: "of the deep",
  setup(g, item) {
    item.name = `${item.name} of the deep`;
    item.magical = true;
    item.rarity = "Rare";
    if (item.icon) item.icon.colour = ItemRarityColours.Rare;

    // TODO When you make an attack with it and speak its command word, it emits a spray of acid. Each creature in a 10-foot-radius sphere centred on the target must make a DC 13 Dexterity saving throw, taking 4d6 acid damage on a failed save, or half as much damage on a successful save. While holding the trident, you are immune to this effect.
  },
};
export default ofTheDeep;
