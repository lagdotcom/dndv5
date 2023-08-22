import EvaluateLater from "../interruptions/EvaluateLater";
import Enchantment from "../types/Enchantment";
import { weaponPlus1 } from "./plus";

const darkSun: Enchantment<"weapon"> = {
  name: "dark sun",
  setup(g, item) {
    weaponPlus1.setup(g, item);
    item.name = `${item.weaponType} of the dark sun`;
    item.attunement = true;
    item.rarity = "Rare";

    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, critical, weapon, map, interrupt } }) => {
        if (weapon === item && attacker.attunements.has(weapon))
          interrupt.add(
            new EvaluateLater(attacker, this, async () => {
              const damageType = "radiant"; // TODO [TERRAIN] daylight check
              map.add(
                damageType,
                await g.rollDamage(
                  1,
                  { source: darkSun, size: 10, attacker, damageType },
                  critical,
                ),
              );
            }),
          );
      },
    );
  },
};
export default darkSun;
