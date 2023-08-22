import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import PCClass from "../../types/PCClass";
import { makeASI } from "../common";

const Druidic = nonCombatFeature(
  "Druidic",
  `You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message's presence with a successful DC 15 Wisdom (Perception) check but can't decipher it without magic.`,
);

export const DruidSpellcasting = new NormalSpellcasting(
  "Druid",
  `Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will.`,
  "wis",
  "full",
  "Druid",
  "Druid",
);

// TODO [CANCELACTION]
const WildShape = notImplementedFeature(
  "Wild Shape",
  `Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.`,
);

// TODO [SUMMONING]
const WildCompanion = notImplementedFeature(
  "Wild Companion",
  `You gain the ability to summon a spirit that assumes an animal form: as an action, you can expend a use of your Wild Shape feature to cast the find familiar spell, without material components.`,
);

const CantripVersatility = nonCombatFeature(
  "Cantrip Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace one cantrip you learned from this class's Spellcasting feature with another cantrip from the druid spell list.`,
);

const TimelessBody = nonCombatFeature(
  "Timeless Body",
  `Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.`,
);

// TODO [GETSPELLINFO]
const BeastSpells = notImplementedFeature(
  "Beast Spells",
  `Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren't able to provide material components.`,
);

// TODO [GETSPELLINFO]
const Archdruid = notImplementedFeature(
  "Archdruid",
  `At 20th level, you can use your Wild Shape an unlimited number of times.

Additionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren't consumed by a spell. You gain this benefit in both your normal shape and your beast shape from Wild Shape.`,
);

export const ASI4 = makeASI("Druid", 4);
export const ASI8 = makeASI("Druid", 8);
export const ASI12 = makeASI("Druid", 12);
export const ASI16 = makeASI("Druid", 16);
export const ASI19 = makeASI("Druid", 19);

const Druid: PCClass = {
  name: "Druid",
  hitDieSize: 8,
  // TODO druids will not wear armor or use shields made of metal
  armorProficiencies: new Set(["light", "medium", "shield"]),
  weaponProficiencies: new Set([
    "club",
    "dagger",
    "dart",
    "javelin",
    "mace",
    "quarterstaff",
    "scimitar",
    "sickle",
    "sling",
    "spear",
  ]),
  toolProficiencies: new Set(["herbalism kit"]),
  saveProficiencies: new Set(["int", "wis"]),
  skillChoices: 2,
  skillProficiencies: new Set([
    "Arcana",
    "Animal Handling",
    "Insight",
    "Medicine",
    "Nature",
    "Perception",
    "Religion",
    "Survival",
  ]),
  features: new Map([
    [1, [Druidic, DruidSpellcasting.feature]],
    [2, [WildShape, WildCompanion]],
    [4, [ASI4, CantripVersatility]],
    [8, [ASI8]],
    [12, [ASI12]],
    [16, [ASI16]],
    [18, [TimelessBody, BeastSpells]],
    [19, [ASI19]],
    [20, [Archdruid]],
  ]),
};
export default Druid;
