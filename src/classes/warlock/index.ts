import {
  nonCombatFeature,
  notImplementedFeature,
  wrapperFeature,
} from "../../features/common";
import { abSet } from "../../types/AbilityName";
import { acSet, wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import { gains } from "../../utils/gain";
import { makeASI } from "../common";
import PactMagic from "./PactMagic";

export const WarlockPactMagic = new PactMagic(
  "Warlock",
  `Your arcane research and the magic bestowed on you by your patron have given you facility with spells.`,
  "cha",
  "Warlock",
  "Warlock",
);

// TODO
const EldritchInvocations = notImplementedFeature(
  "Eldritch Invocation",
  `In your study of occult lore, you have unearthed eldritch invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability.

At 2nd level, you gain two eldritch invocations of your choice. A list of the available options can be found on the Optional Features page. When you gain certain warlock levels, you gain additional invocations of your choice, as shown in the Invocations Known column of the Warlock table.

Additionally, when you gain a level in this class, you can choose one of the invocations you know and replace it with another invocation that you could learn at that level.

If an eldritch invocation has prerequisites, you must meet them to learn it. You can learn the invocation at the same time that you meet its prerequisites. A level prerequisite refers to your level in this class.`,
);

export const PactBoon = wrapperFeature(
  "Pact Boon",
  `At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice.`,
);

// TODO
export const PactOfTheBlade = notImplementedFeature(
  "Pact of the Blade",
  `You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it (see chapter 5 for weapon options). You are proficient with it while you wield it. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.

Your pact weapon disappears if it is more than 5 feet away from you for 1 minute or more. It also disappears if you use this feature again, if you dismiss the weapon (no action required), or if you die.

You can transform one magic weapon into your pact weapon by performing a special ritual while you hold the weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. You can then dismiss the weapon, shunting it into an extradimensional space, and it appears whenever you create your pact weapon thereafter. You can't affect an artifact or a sentient weapon in this way. The weapon ceases being your pact weapon if you die, if you perform the 1-hour ritual on a different weapon, or if you use a 1-hour ritual to break your bond to it. The weapon appears at your feet if it is in the extradimensional space when the bond breaks.`,
);

// TODO
export const PactOfTheChain = notImplementedFeature(
  "Pact of the Chain",
  `You learn the find familiar spell and can cast it as a ritual. The spell doesn't count against your number of spells known.

When you cast the spell, you can choose one of the normal forms for your familiar or one of the following special forms: imp, pseudodragon, quasit, or sprite.

Additionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to use its reaction to make one attack of its own.`,
);

// TODO
export const PactOfTheTalisman = notImplementedFeature(
  "Pact of the Talisman",
  `Your patron gives you an amulet, a talisman that can aid the wearer when the need is great. When the wearer fails an ability check, they can add a d4 to the roll, potentially turning the roll into a success. This benefit can be used a number of times equal to your proficiency bonus, and all expended uses are restored when you finish a long rest.

If you lose the talisman, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous amulet. The talisman turns to ash when you die.`,
);

// TODO
export const PactOfTheTome = notImplementedFeature(
  "Pact of the Tome",
  `Your patron gives you a grimoire called a Book of Shadows. When you gain this feature, choose three cantrips from any class's spell list. The cantrips do not need to be from the same spell list. While the book is on your person, you can cast those cantrips at will. They don't count against your number of cantrips known. Any cantrip you cast with this feature is considered a warlock cantrip for you. If you lose your Book of Shadows, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous book. The book turns to ash when you die.`,
);

const EldritchVersatility = nonCombatFeature(
  "Eldritch Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, representing a change of focus in your occult studies:
- Replace one cantrip you learned from this class's Pact Magic feature with another cantrip from the warlock spell list.
- Replace the option you chose for the Pact Boon feature with one of that feature's other options.
- If you're 12th level or higher, replace one spell from your Mystic Arcanum feature with another warlock spell of the same level.

If this change makes you ineligible for any of your Eldritch Invocations, you must also replace them now, choosing invocations for which you qualify.`,
);

// TODO
const MysticArcanum = notImplementedFeature(
  "Mystic Arcanum",
  `At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum.

You can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.

At higher levels, you gain more warlock spells of your choice that can be cast in this way: one 7th-level spell at 13th level, one 8th-level spell at 15th level, and one 9th-level spell at 17th level. You regain all uses of your Mystic Arcanum when you finish a long rest.`,
);

const EldritchMaster = nonCombatFeature(
  "Eldritch Master",
  `At 20th level, you can draw on your inner reserve of mystical power while entreating your patron to regain expended spell slots. You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature. Once you regain spell slots with this feature, you must finish a long rest before you can do so again.`,
);

export const ASI4 = makeASI("Warlock", 4);
export const ASI8 = makeASI("Warlock", 8);
export const ASI12 = makeASI("Warlock", 12);
export const ASI16 = makeASI("Warlock", 16);
export const ASI19 = makeASI("Warlock", 19);

const Warlock: PCClass = {
  name: "Warlock",
  hitDieSize: 8,
  armor: acSet("light"),
  weaponCategory: wcSet("simple"),
  save: abSet("wis", "cha"),
  skill: gains([], 2, [
    "Arcana",
    "Deception",
    "History",
    "Intimidation",
    "Investigation",
    "Nature",
    "Religion",
  ]),
  multi: {
    requirements: new Map([["cha", 13]]),
    armor: acSet("light"),
    weaponCategory: wcSet("simple"),
  },

  features: new Map([
    [1, [WarlockPactMagic.feature]],
    [2, [EldritchInvocations]],
    [3, [PactBoon]],
    [4, [ASI4, EldritchVersatility]],
    [8, [ASI8]],
    [11, [MysticArcanum]],
    [12, [ASI12]],
    [16, [ASI16]],
    [19, [ASI19]],
    [20, [EldritchMaster]],
  ]),
};
export default Warlock;
