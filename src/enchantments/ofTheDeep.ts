import { ItemRarityColours } from "../colours";
import YesNoChoice from "../interruptions/YesNoChoice";
import Enchantment from "../types/Enchantment";

const ofTheDeep: Enchantment<"weapon"> = {
  name: "weapon of the deep",
  setup(g, item) {
    item.name = `${item.name} of the deep`;
    item.magical = true;
    item.rarity = "Rare";
    if (item.icon) item.icon.colour = ItemRarityColours.Rare;

    // When you make an attack with it and speak its command word, it emits a spray of acid. Each creature within 10 feet of the target must make a DC 13 Dexterity saving throw, taking 4d6 acid damage on a failed save, or half as much damage on a successful save. While holding the trident, you are immune to this effect.
    let charges = 1;
    g.events.on("Attack", ({ detail: { interrupt, roll } }) => {
      if (charges && roll.type.weapon === item)
        interrupt.add(
          new YesNoChoice(
            roll.type.who,
            ofTheDeep,
            item.name,
            "Speak the command word and emit a spray of acid?",
            async () => {
              charges--;

              const damage = await g.rollDamage(4, {
                attacker: roll.type.who,
                damageType: "acid",
                size: 6,
                source: ofTheDeep,
              });

              const targets = g.getInside(
                { type: "within", radius: 10, who: roll.type.target },
                [roll.type.who],
              );

              for (const target of targets) {
                const { damageResponse } = await g.save({
                  source: ofTheDeep,
                  type: { type: "flat", dc: 13 },
                  attacker: roll.type.who,
                  who: target,
                  ability: "dex",
                  tags: ["magic"],
                });

                await g.damage(
                  ofTheDeep,
                  "acid",
                  { attacker: roll.type.who, target },
                  [["acid", damage]],
                  damageResponse,
                );
              }
            },
          ),
        );
    });
  },
};
export default ofTheDeep;
