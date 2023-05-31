import CastSpell from "../../actions/CastSpell";
import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import PCClass from "../../types/PCClass";
import { makeASI } from "../common";

// TODO
const DivineSense = notImplementedFeature(
  "Divine Sense",
  `The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity (the vampire Count Strahd von Zarovich, for instance). Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the hallow spell.

You can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.`
);

// TODO
const LayOnHands = notImplementedFeature(
  "Lay on Hands",
  `Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5.

As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.

Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.

This feature has no effect on undead and constructs.`
);

// TODO
const DivineSmite = notImplementedFeature(
  "Divine Smite",
  `Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend, to a maximum of 6d8.`
);

// TODO
const FightingStyle = notImplementedFeature(
  "Fighting Style",
  `At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take the same Fighting Style option more than once, even if you get to choose again.`
);

export const PaladinSpellcasting = new NormalSpellcasting(
  "Spellcasting",
  "cha",
  "half"
);
const Spellcasting = new SimpleFeature(
  "Spellcasting",
  `By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.`,
  (g, me) => {
    PaladinSpellcasting.initialise(me, me.classLevels.get("Paladin") ?? 1);

    g.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who === me) {
        // TODO rituals in knownSpells

        for (const spell of me.preparedSpells) {
          if (spell.lists.includes("Paladin"))
            actions.push(new CastSpell(g, me, PaladinSpellcasting, spell));
        }
      }
    });
  }
);

// TODO
const DivineHealth = notImplementedFeature(
  "Divine Health",
  `By 3rd level, the divine magic flowing through you makes you immune to disease.`
);

const MartialVersatility = nonCombatFeature(
  "Martial Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to paladins. This replacement represents a shift of focus in your martial practice.`
);

// TODO
const ExtraAttack = notImplementedFeature(
  "Extra Attack",
  `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`
);

// TODO
const AuraOfProtection = notImplementedFeature(
  "Aura of Protection",
  `Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.

At 18th level, the range of this aura increases to 30 feet.`
);

// TODO
const AuraOfCourage = notImplementedFeature(
  "Aura of Courage",
  `Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`
);

// TODO
const ImprovedDivineSmite = notImplementedFeature(
  "Improved Divine Smite",
  `By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.`
);

// TODO
const CleansingTouch = notImplementedFeature(
  "Cleansing Touch",
  `Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.

You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain expended uses when you finish a long rest.`
);

export const ASI4 = makeASI("Paladin", 4);
export const ASI8 = makeASI("Paladin", 8);
export const ASI12 = makeASI("Paladin", 12);
export const ASI16 = makeASI("Paladin", 16);
export const ASI19 = makeASI("Paladin", 19);

const Paladin: PCClass = {
  name: "Paladin",
  hitDieSize: 10,
  armorProficiencies: new Set(["light", "medium", "heavy", "shield"]),
  weaponCategoryProficiencies: new Set(["simple", "martial"]),
  saveProficiencies: new Set(["wis", "cha"]),
  skillChoices: 2,
  skillProficiencies: new Set([
    "Athletics",
    "Insight",
    "Intimidation",
    "Medicine",
    "Persuasion",
    "Religion",
  ]),
  features: new Map([
    [1, [DivineSense, LayOnHands]],
    [2, [DivineSmite, FightingStyle, Spellcasting]],
    [3, [DivineHealth]],
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
