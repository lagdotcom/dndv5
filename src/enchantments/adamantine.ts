import Enchantment from "../types/Enchantment";

const adamantine: Enchantment<"armor"> = {
  name: "adamantine",
  setup(g, item) {
    item.name = `adamantine ${item.name}`;
    item.rarity = "Uncommon";

    g.events.on("Attack", ({ detail: { roll, outcome } }) => {
      if (roll.type.target.armor === item) outcome.ignoreValue("critical");
    });
  },
};
export default adamantine;
