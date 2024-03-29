import {
  nonCombatFeature,
  notImplementedFeature,
  wrapperFeature,
} from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import PickFromListChoice from "../../interruptions/PickFromListChoice";
import {
  getMaxSpellSlotAvailable,
  SpellSlotResources,
} from "../../spells/NormalSpellcasting";
import { abSet } from "../../types/AbilityName";
import { atSet } from "../../types/AttackTag";
import { ctSet } from "../../types/CreatureType";
import { acSet, wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import Priority from "../../types/Priority";
import { gains } from "../../utils/gain";
import { enumerate, ordinal } from "../../utils/numbers";
import { hasAll } from "../../utils/set";
import { ChannelDivinityResource, makeASI, makeExtraAttack } from "../common";
import AuraOfProtection, { getAuraOfProtection } from "./AuraOfProtection";
import { PaladinSpellcasting } from "./common";
import HarnessDivinePower from "./HarnessDivinePower";
import LayOnHands from "./LayOnHands";

// TODO [SIGHT]
const DivineSense = notImplementedFeature(
  "Divine Sense",
  `The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity (the vampire Count Strahd von Zarovich, for instance). Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the hallow spell.

You can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.`,
);

const extraSmiteDiceTypes = ctSet("undead", "fiend");
export const DivineSmite = new SimpleFeature(
  "Divine Smite",
  `Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend, to a maximum of 6d8.`,
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, critical, interrupt, map, target } }) => {
        if (
          attacker === me &&
          hasAll(attack?.roll.type.tags, ["melee", "weapon"])
        )
          interrupt.add(
            new PickFromListChoice(
              attacker,
              DivineSmite,
              "Divine Smite",
              "Choose a spell slot to use.",
              Priority.Normal,
              enumerate(1, getMaxSpellSlotAvailable(me)).map((value) => ({
                label: ordinal(value),
                value,
                disabled: me.getResource(SpellSlotResources[value]) < 1,
              })),
              async (slot) => {
                me.spendResource(SpellSlotResources[slot], 1);

                const count = Math.min(5, slot + 1);
                const extra = extraSmiteDiceTypes.has(target.type) ? 1 : 0;

                const damage = await g.rollDamage(
                  count + extra,
                  {
                    source: DivineSmite,
                    attacker,
                    size: 8,
                    tags: atSet("magical"),
                  },
                  critical,
                );
                map.add("radiant", damage);
              },
              true,
            ),
          );
      },
    );
  },
);

export const PaladinFightingStyle = wrapperFeature(
  "Fighting Style (Paladin)",
  `At 2nd level, you adopt a particular style of fighting as your specialty. You can't take the same Fighting Style option more than once, even if you get to choose again.`,
);

const DivineHealth = new SimpleFeature(
  "Divine Health",
  `By 3rd level, the divine magic flowing through you makes you immune to disease.`,
  (g, me) => {
    g.events.on("BeforeEffect", ({ detail: { who, effect, success } }) => {
      if (who === me && effect.tags.has("disease"))
        success.add("fail", DivineHealth);
    });
  },
);

const ChannelDivinity = new SimpleFeature(
  "Channel Divinity",
  `Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it.
When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again.
Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC.`,
  (g, me) => {
    me.initResource(ChannelDivinityResource, 1);
  },
);

const MartialVersatility = nonCombatFeature(
  "Martial Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to paladins. This replacement represents a shift of focus in your martial practice.`,
);

const ExtraAttack = makeExtraAttack(
  "Extra Attack",
  `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
);

const AuraOfCourage = new SimpleFeature(
  "Aura of Courage",
  `Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`,
  (g, me) => {
    const aura = getAuraOfProtection(me);
    if (!aura) return;

    g.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
      if (
        config.conditions?.has("Frightened") &&
        who.side === me.side &&
        aura.isAffecting(who)
      )
        success.add("fail", AuraOfCourage);
    });
  },
);

const ImprovedDivineSmite = new SimpleFeature(
  "Improved Divine Smite",
  `By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.`,
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attack, attacker, critical, target, interrupt, map } }) => {
        if (
          attacker === me &&
          hasAll(attack?.roll.type.tags, ["melee", "weapon"])
        )
          interrupt.add(
            new EvaluateLater(
              attacker,
              ImprovedDivineSmite,
              Priority.Normal,
              async () => {
                const amount = await g.rollDamage(
                  1,
                  {
                    source: ImprovedDivineSmite,
                    attacker,
                    target,
                    size: 8,
                    damageType: "radiant",
                    tags: atSet("magical"),
                  },
                  critical,
                );
                map.add("radiant", amount);
              },
            ),
          );
      },
    );
  },
);

// TODO [DISPEL]
const CleansingTouch = notImplementedFeature(
  "Cleansing Touch",
  `Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.

You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain expended uses when you finish a long rest.`,
);

export const ASI4 = makeASI("Paladin", 4);
export const ASI8 = makeASI("Paladin", 8);
export const ASI12 = makeASI("Paladin", 12);
export const ASI16 = makeASI("Paladin", 16);
export const ASI19 = makeASI("Paladin", 19);

const Paladin: PCClass = {
  name: "Paladin",
  hitDieSize: 10,
  armor: acSet("light", "medium", "heavy", "shield"),
  weaponCategory: wcSet("simple", "martial"),
  save: abSet("wis", "cha"),
  skill: gains([], 2, [
    "Athletics",
    "Insight",
    "Intimidation",
    "Medicine",
    "Persuasion",
    "Religion",
  ]),
  multi: {
    requirements: new Map([
      ["str", 13],
      ["cha", 13],
    ]),
    armor: acSet("light", "medium", "shield"),
    weaponCategory: wcSet("simple", "martial"),
  },

  features: new Map([
    [1, [DivineSense, LayOnHands]],
    [2, [DivineSmite, PaladinFightingStyle, PaladinSpellcasting.feature]],
    [3, [DivineHealth, ChannelDivinity, HarnessDivinePower]],
    [4, [ASI4, MartialVersatility]],
    [5, [ExtraAttack]],
    [6, [AuraOfProtection]],
    [8, [ASI8]],
    [10, [AuraOfCourage]],
    [11, [ImprovedDivineSmite]],
    [12, [ASI12]],
    [14, [CleansingTouch]],
    [16, [ASI16]],
    [19, [ASI19]],
  ]),
};
export default Paladin;
