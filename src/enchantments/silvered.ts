import Enchantment from "../types/Enchantment";

const silvered: Enchantment<"weapon" | "ammo"> = {
  name: "silvered",
  setup(g, item) {
    item.name = `silvered ${item.name}`;

    g.events.on("BeforeAttack", ({ detail: { weapon, ammo, tags } }) => {
      if (weapon === item || ammo === item) tags.add("silvered");
    });
  },
};
export default silvered;
