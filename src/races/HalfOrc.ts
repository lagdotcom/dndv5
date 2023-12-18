import { Darkvision60, notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import EvaluateLater from "../interruptions/EvaluateLater";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import Priority from "../types/Priority";
import SizeCategory from "../types/SizeCategory";

const Menacing = new SimpleFeature(
  "Menacing",
  `You gain proficiency in the Intimidation skill.`,
  (g, me) => {
    me.addProficiency("Intimidation", "proficient");
  },
);

// TODO
const RelentlessEndurance = notImplementedFeature(
  "Relentless Endurance",
  `When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can’t use this feature again until you finish a long rest.`,
);

const SavageAttacks = new SimpleFeature(
  "Brutal Critical",
  `When you score a critical hit with a melee weapon attack, you can roll one of the weapon’s damage dice one additional time and add it to the extra damage of the critical hit.`,
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({
        detail: {
          attacker,
          attack,
          critical,
          interrupt,
          weapon,
          target,
          bonus,
        },
      }) => {
        if (attacker === me && attack?.pre.tags.has("melee") && critical) {
          const base = weapon?.damage;

          if (base?.type === "dice") {
            interrupt.add(
              new EvaluateLater(
                me,
                SavageAttacks,
                Priority.Normal,
                async () => {
                  const damage = await g.rollDamage(
                    1,
                    {
                      source: SavageAttacks,
                      attacker: me,
                      damageType: base.damageType,
                      size: base.amount.size,
                      target,
                      weapon,
                      tags: attack.pre.tags,
                    },
                    false,
                  );

                  bonus.add(damage, SavageAttacks);
                },
              ),
            );
          }
        }
      },
    );
  },
);

export const HalfOrc: PCRace = {
  name: "Half-Orc",
  abilities: new Map([
    ["str", 2],
    ["con", 1],
  ]),
  size: SizeCategory.Medium,
  movement: new Map([["speed", 30]]),
  features: new Set([
    Darkvision60,
    Menacing,
    RelentlessEndurance,
    SavageAttacks,
  ]),
  languages: laSet("Common", "Orc"),
};
