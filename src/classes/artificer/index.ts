import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import { abSet } from "../../types/AbilityName";
import { acSet, wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import { skSet } from "../../types/SkillName";
import { toSet } from "../../types/ToolName";
import { makeASI } from "../common";
import FlashOfGenius from "./FlashOfGenius";

export const ArtificerSpellcasting = new NormalSpellcasting(
  "Artificer",
  `You have studied the workings of magic and how to channel it through objects. As a result, you have gained the ability to cast spells. To observers, you don't appear to be casting spells in a conventional way; you look as if you're producing wonders using mundane items or outlandish inventions.`,
  "int",
  "half",
  "Artificer",
  "Artificer",
);

const MagicalTinkering = nonCombatFeature(
  "Magical Tinkering",
  `At 1st level, you learn how to invest a spark of magic into mundane objects. To use this ability, you must have thieves' tools or artisan's tools in hand. You then touch a Tiny nonmagical object as an action and give it one of the following magical properties of your choice:
- The object sheds bright light in a 5-foot radius and dim light for an additional 5 feet.
- Whenever tapped by a creature, the object emits a recorded message that can be heard up to 10 feet away. You utter the message when you bestow this property on the object, and the recording can be no more than 6 seconds long.
- The object continuously emits your choice of an odor or a nonverbal sound (wind, waves, chirping, or the like). The chosen phenomenon is perceivable up to 10 feet away.
- A static visual effect appears on one of the object's surfaces. This effect can be a picture, up to 25 words of text, lines and shapes, or a mixture of these elements, as you like.

The chosen property lasts indefinitely. As an action, you can touch the object and end the property early.
You can bestow magic on multiple objects, touching one object each time you use this feature, though a single object can only bear one property at a time. The maximum number of objects you can affect with this feature at one time is equal to your Intelligence modifier (minimum of one object). If you try to exceed your maximum, the oldest property immediately ends, and then the new property applies.`,
);

const InfuseItem = nonCombatFeature(
  "Infuse Item",
  `At 2nd level, you gain the ability to imbue mundane items with certain magical infusions. The magic items you create with this feature are effectively prototypes of permanent items.`,
);

const TheRightToolForTheJob = nonCombatFeature(
  "The Right Tool for the Job",
  `At 3rd level, you learn how to produce exactly the tool you need: with thieves' tools or artisan's tools in hand, you can magically create one set of artisan's tools in an unoccupied space within 5 feet of you. This creation requires 1 hour of uninterrupted work, which can coincide with a short or long rest. Though the product of magic, the tools are nonmagical, and they vanish when you use this feature again.`,
);

const ToolExpertise = new SimpleFeature(
  "Tool Expertise",
  `Starting at 6th level, your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool.`,
  (g, me) => {
    g.events.on("BeforeCheck", ({ detail: { who, tool, proficiency } }) => {
      if (who === me && tool) proficiency.add("expertise", ToolExpertise);
    });
  },
);

// TODO [ATTUNEMENTLIMIT]
const MagicItemAdept = nonCombatFeature(
  "Magic Item Adept",
  `When you reach 10th level, you achieve a profound understanding of how to use and make magic items:
- You can attune to up to four magic items at once.
- If you craft a magic item with a rarity of common or uncommon, it takes you a quarter of the normal time, and it costs you half as much of the usual gold.`,
);

// TODO write 'enchantment' function for this
const SpellStoringItem = nonCombatFeature(
  "Spell-Storing Item",
  `At 11th level, you learn how to store a spell in an object. Whenever you finish a long rest, you can touch one simple or martial weapon or one item that you can use as a spellcasting focus, and you store a spell in it, choosing a 1st- or 2nd-level spell from the artificer spell list that requires 1 action to cast (you needn't have it prepared).

While holding the object, a creature can take an action to produce the spell's effect from it, using your spellcasting ability modifier. If the spell requires concentration, the creature must concentrate. The spell stays in the object until it's been used a number of times equal to twice your Intelligence modifier (minimum of twice) or until you use this feature again to store a spell in an object.`,
);

// TODO [ATTUNEMENTLIMIT]
const MagicItemSavant = nonCombatFeature(
  "Magic Item Savant",
  `At 14th level, your skill with magic items deepens more:
- You can attune to up to five magic items at once.
- You ignore all class, race, spell, and level requirements on attuning to or using a magic item.`,
);

// TODO [ATTUNEMENTLIMIT]
const MagicItemMaster = nonCombatFeature(
  "Magic Item Master",
  `Starting at 18th level, you can attune to up to six magic items at once.`,
);

// TODO [DAMAGEINTERRUPT]
const SoulOfArtifice = notImplementedFeature(
  "Soul of Artifice",
  `At 20th level, you develop a mystical connection to your magic items, which you can draw on for protection:
- You gain a +1 bonus to all saving throws per magic item you are currently attuned to.
- If you're reduced to 0 hit points but not killed outright, you can use your reaction to end one of your artificer infusions, causing you to drop to 1 hit point instead of 0.`,
);

export const ASI4 = makeASI("Artificer", 4);
export const ASI8 = makeASI("Artificer", 8);
export const ASI12 = makeASI("Artificer", 12);
export const ASI16 = makeASI("Artificer", 16);
export const ASI19 = makeASI("Artificer", 19);

const Artificer: PCClass = {
  name: "Artificer",
  hitDieSize: 8,
  armorProficiencies: acSet("light", "medium", "shield"),
  weaponCategoryProficiencies: wcSet("simple"),
  // TODO ...and one type of artisan's tools of your choice
  toolProficiencies: toSet("thieves' tools", "tinker's tools"),
  saveProficiencies: abSet("con", "int"),
  skillChoices: 2,
  skillProficiencies: skSet(
    "Arcana",
    "History",
    "Investigation",
    "Medicine",
    "Nature",
    "Perception",
    "Sleight of Hand",
  ),

  features: new Map([
    [1, [MagicalTinkering, ArtificerSpellcasting.feature]],
    [2, [InfuseItem]],
    [3, [TheRightToolForTheJob]],
    [4, [ASI4]],
    [6, [ToolExpertise]],
    [7, [FlashOfGenius]],
    [8, [ASI8]],
    [10, [MagicItemAdept]],
    [11, [SpellStoringItem]],
    [12, [ASI12]],
    [14, [MagicItemSavant]],
    [16, [ASI16]],
    [18, [MagicItemMaster]],
    [19, [ASI19]],
    [20, [SoulOfArtifice]],
  ]),
};
export default Artificer;
