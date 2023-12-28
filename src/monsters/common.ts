import SimpleFeature from "../features/SimpleFeature";
import { MundaneDamageTypes } from "../types/DamageType";
import { getFlanker } from "../utils/dnd";
import { isA } from "../utils/types";

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
  `This has advantage on Wisdom (Perception) checks that rely on hearing.`,
  (g, me) => {
    g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
      if (who === me && tags.has("hearing"))
        diceType.add("advantage", KeenHearing);
    });
  },
);

export const KeenSmell = new SimpleFeature(
  "Keen Smell",
  `This has advantage on Wisdom (Perception) checks that rely on smell.`,
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
