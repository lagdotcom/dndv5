import SimpleFeature from "../features/SimpleFeature";
import EvaluateLater from "../interruptions/EvaluateLater";
import { MundaneDamageTypes } from "../types/DamageType";
import Priority from "../types/Priority";
import { getFlanker } from "../utils/dnd";
import { isA } from "../utils/types";

export const Brute = new SimpleFeature(
  "Brute",
  `A melee weapon deals one extra die of its damage when you hit with it.`,
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, weapon, interrupt, bonus } }) => {
        if (
          attacker === me &&
          attack?.roll.type.tags.has("melee") &&
          weapon?.damage.type === "dice"
        ) {
          const { size } = weapon.damage.amount;

          interrupt.add(
            new EvaluateLater(me, Brute, Priority.Normal, async () => {
              const extra = await g.rollDamage(1, {
                size,
                source: Brute,
                attacker: me,
                tags: attack.roll.type.tags,
              });
              bonus.add(extra, Brute);
            }),
          );
        }
      },
    );
  },
);

export const ExhaustionImmunity = new SimpleFeature(
  "Exhaustion Immunity",
  `You are immune to exhaustion.`,
  (g, me) => {
    g.events.on("Exhaustion", ({ detail: { who, delta, success } }) => {
      if (who === me && delta > 0) success.add("fail", ExhaustionImmunity);
    });
  },
);

export const KeenHearing = new SimpleFeature(
  "Keen Hearing",
  `You have advantage on Wisdom (Perception) checks that rely on hearing.`,
  (g, me) => {
    g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
      if (who === me && tags.has("hearing"))
        diceType.add("advantage", KeenHearing);
    });
  },
);

export const KeenHearingAndSight = new SimpleFeature(
  "Keen Hearing and Sight",
  `You have advantage on Wisdom (Perception) checks that rely on hearing or sight.`,
  (g, me) => {
    g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
      if (who === me && (tags.has("hearing") || tags.has("sight")))
        diceType.add("advantage", KeenHearingAndSight);
    });
  },
);

export const KeenSmell = new SimpleFeature(
  "Keen Smell",
  `You have advantage on Wisdom (Perception) checks that rely on smell.`,
  (g, me) => {
    g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
      if (who === me && tags.has("smell")) diceType.add("advantage", KeenSmell);
    });
  },
);

export const MagicResistance = new SimpleFeature(
  "Magic Resistance",
  `You have advantage on saving throws against spells and other magical effects.`,
  (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, tags, diceType } }) => {
      if (who === me && tags.has("magic"))
        diceType.add("advantage", MagicResistance);
    });
  },
);

export const MundaneDamageResistance = new SimpleFeature(
  "Mundane Damage Resistance",
  "You resist bludgeoning, piercing, and slashing damage from nonmagical attacks.",
  (g, me) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, attack, response } }) => {
        if (
          who === me &&
          !attack?.roll.type.tags.has("magical") &&
          isA(damageType, MundaneDamageTypes)
        )
          response.add("resist", MundaneDamageResistance);
      },
    );
  },
);

export const PackTactics = new SimpleFeature(
  "Pack Tactics",
  `This has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally isn't incapacitated.`,
  (g, me) => {
    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      if (who === me && getFlanker(g, me, target))
        diceType.add("advantage", PackTactics);
    });
  },
);

export const SpellDamageResistance = new SimpleFeature(
  "Spell Damage Resistance",
  `You resist damage from spells.`,
  (g, me) => {
    g.events.on("GetDamageResponse", ({ detail: { who, spell, response } }) => {
      if (who === me && spell) response.add("resist", SpellDamageResistance);
    });
  },
);
