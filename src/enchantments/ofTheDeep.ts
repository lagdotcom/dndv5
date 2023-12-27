import { ItemRarityColours } from "../colours";
import YesNoChoice from "../interruptions/YesNoChoice";
import { atSet } from "../types/AttackTag";
import Enchantment from "../types/Enchantment";
import Priority from "../types/Priority";

const ofTheDeep: Enchantment<"weapon"> = {
  name: "weapon of the deep",
  setup(g, item) {
    item.name = `${item.name} of the deep`;
    item.magical = true;
    item.rarity = "Rare";
    if (item.icon) item.icon.colour = ItemRarityColours.Rare;

    // When you make an attack with it and speak its command word, it emits a spray of acid. Each creature within 10 feet of the target must make a DC 13 Dexterity saving throw, taking 4d6 acid damage on a failed save, or half as much damage on a successful save. While holding the trident, you are immune to this effect.
    let charges = 1;
    g.events.on(
      "Attack",
      ({
        detail: {
          interrupt,
          roll: {
            type: { weapon, who: attacker, target },
          },
        },
      }) => {
        if (charges && weapon === item)
          interrupt.add(
            new YesNoChoice(
              attacker,
              ofTheDeep,
              item.name,
              "Speak the command word and emit a spray of acid?",
              Priority.Late,
              async () => {
                charges--;

                const damage = await g.rollDamage(4, {
                  attacker,
                  damageType: "acid",
                  size: 6,
                  source: ofTheDeep,
                  tags: atSet("magical"),
                });

                const targets = g.getInside(
                  { type: "within", radius: 10, who: target },
                  [attacker],
                );

                for (const target of targets) {
                  const { damageResponse } = await g.save({
                    source: ofTheDeep,
                    type: { type: "flat", dc: 13 },
                    attacker,
                    who: target,
                    ability: "dex",
                    tags: ["magic"],
                  });

                  await g.damage(
                    ofTheDeep,
                    "acid",
                    { attacker, target },
                    [["acid", damage]],
                    damageResponse,
                  );
                }
              },
            ),
          );
      },
    );
  },
};
export default ofTheDeep;
