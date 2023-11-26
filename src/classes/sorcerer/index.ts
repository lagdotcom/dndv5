import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import { abSet } from "../../types/AbilityName";
import PCClass from "../../types/PCClass";
import { skSet } from "../../types/SkillName";
import { makeASI } from "../common";

export const ASI4 = makeASI("Sorcerer", 4);
export const ASI8 = makeASI("Sorcerer", 8);
export const ASI12 = makeASI("Sorcerer", 12);
export const ASI16 = makeASI("Sorcerer", 16);
export const ASI19 = makeASI("Sorcerer", 19);

export const SorcererSpellcasting = new NormalSpellcasting(
  "Sorcerer",
  `An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. This font of magic, whatever its origin, fuels your spells.`,
  "cha",
  "full",
  "Sorcerer",
  "Sorcerer",
);

// TODO
const FontOfMagic = notImplementedFeature(
  "Font of Magic",
  `At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects.

Sorcery Points
You have 2 sorcery points, and you gain one additional point every time you level up, to a maximum of 20 at level 20. You can never have more sorcery points than shown on the table for your level. You regain all spent sorcery points when you finish a long rest.

Flexible Casting
You can use your sorcery points to gain additional spell slots, or sacrifice spell slots to gain additional sorcery points. You learn other ways to use your sorcery points as you reach higher levels.

Creating Spell Slots: You can transform unexpended sorcery points into one spell slot as a bonus action on your turn. The created spell slots vanish at the end of a long rest. The Creating Spell Slots table shows the cost of creating a spell slot of a given level. You can create spell slots no higher in level than 5th.
-  1st	2
-  2nd	3
-  3rd	5
-  4th	6
-  5th	7
Converting a Spell Slot to Sorcery Points: As a bonus action on your turn, you can expend one spell slot and gain a number of sorcery points equal to the slot's level.`,
);

// TODO
const Metamagic = notImplementedFeature(
  "Metamagic",
  `At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.

You can use only one Metamagic option on a spell when you cast it, unless otherwise noted.`,
);

const SorcerousVersatility = nonCombatFeature(
  "Sorcerous Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, representing the magic within you flowing in new ways:
- Replace one of the options you chose for the Metamagic feature with a different Metamagic option available to you.
- Replace one cantrip you learned from this class's Spellcasting feature with another cantrip from the sorcerer spell list.`,
);

// TODO
const MagicalGuidance = notImplementedFeature(
  "Magical Guidance",
  `You can tap into your inner wellspring of magic to try to conjure success from failure. When you make an ability check that fails, you can spend 1 sorcery point to reroll the d20, and you must use the new roll, potentially turning the failure into a success.`,
);

const SorcerousRestoration = nonCombatFeature(
  "Sorcerous Restoration",
  `At 20th level, you regain 4 expended sorcery points whenever you finish a short rest.`,
);

const Sorcerer: PCClass = {
  name: "Sorcerer",
  hitDieSize: 6,
  weaponProficiencies: new Set([
    "dagger",
    "dart",
    "sling",
    "quarterstaff",
    "light crossbow",
  ]),
  saveProficiencies: abSet("con", "cha"),
  skillChoices: 2,
  skillProficiencies: skSet(
    "Arcana",
    "Deception",
    "Insight",
    "Intimidation",
    "Persuasion",
    "Religion",
  ),
  features: new Map([
    [1, [SorcererSpellcasting.feature]],
    [2, [FontOfMagic]],
    [3, [Metamagic]],
    [4, [ASI4, SorcerousVersatility]],
    [5, [MagicalGuidance]],
    [8, [ASI8]],
    [12, [ASI12]],
    [16, [ASI16]],
    [19, [ASI19]],
    [20, [SorcerousRestoration]],
  ]),
};
export default Sorcerer;
