import EvaluateLater from "../../interruptions/EvaluateLater";
import Priority from "../../types/Priority";
import SimpleFeature from "../SimpleFeature";

const FightingStyleGreatWeaponFighting = new SimpleFeature(
  "Fighting Style: Great Weapon Fighting",
  `When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.`,
  (g, me) => {
    g.events.on(
      "DiceRolled",
      ({ detail: { type, values, interrupt, size } }) => {
        if (
          type.type === "damage" &&
          type.attacker === me &&
          type.tags.has("melee") &&
          type.tags.has("weapon") &&
          type.tags.has("two hands") &&
          values.final <= 2
        )
          interrupt.add(
            new EvaluateLater(
              me,
              FightingStyleGreatWeaponFighting,
              Priority.ChangesOutcome,
              async () => {
                const newRoll = await g.roll({
                  type: "other",
                  source: FightingStyleGreatWeaponFighting,
                  who: me,
                  size,
                });

                values.replace(newRoll.values.final);
              },
            ),
          );
      },
    );
  },
);
export default FightingStyleGreatWeaponFighting;
