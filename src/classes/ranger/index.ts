import {
  nonCombatFeature,
  notImplementedFeature,
  wrapperFeature,
} from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import { abSet } from "../../types/AbilityName";
import { acSet, wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import { skSet } from "../../types/SkillName";
import { makeASI, makeExtraAttack } from "../common";

export const Favored = wrapperFeature(
  "Favored Enemy/Foe",
  `Choose either Favored Enemy or Favored Foe.`,
);

export const FavoredEnemy = notImplementedFeature(
  "Favored Enemy",
  `Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.

Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.

You have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.

When you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.

You choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures.`,
);

export const FavoredFoe = notImplementedFeature(
  "Favored Foe",
  `When you hit a creature with an attack roll, you can call on your mystical bond with nature to mark the target as your favored enemy for 1 minute or until you lose your concentration (as if you were concentrating on a spell).

The first time on each of your turns that you hit the favored enemy and deal damage to it, including when you mark it, you can increase that damage by 1d4.

You can use this feature to mark a favored enemy a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.

This feature's extra damage increases when you reach certain levels in this class: to 1d6 at 6th level and to 1d8 at 14th level.`,
);

export const Explorer = wrapperFeature(
  "Natural/Deft Explorer",
  `Choose either Natural Explorer or Deft Explorer.`,
);

export const NaturalExplorer = notImplementedFeature(
  "Natural Explorer",
  `You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, swamp, or the Underdark. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you're proficient in.

While traveling for an hour or more in your favored terrain, you gain the following benefits:
- Difficult terrain doesn't slow your group's travel.
- Your group can't become lost except by magical means.
- Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.
- If you are traveling alone, you can move stealthily at a normal pace.
- When you forage, you find twice as much food as you normally would.
- While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.

You choose additional favored terrain types at 6th and 10th level.`,
);

export const DeftExplorer = new SimpleFeature(
  "Deft Explorer",
  `You are an unsurpassed explorer and survivor, both in the wilderness and in dealing with others on your travels. You gain the Canny benefit below, and you gain an additional benefit below when you reach 6th level and 10th level in this class.`,
  (g, me) => {
    me.addFeature(Canny, true);

    const level = me.classLevels.get("Ranger") ?? 1;
    if (level >= 6) me.addFeature(Roving, true);
    if (level >= 10) me.addFeature(Tireless, true);
  },
);

export const Canny = notImplementedFeature(
  "Canny",
  `Choose one of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses the chosen skill.

You can also speak, read, and write two additional languages of your choice.`,
);

const RangerFightingStyle = wrapperFeature(
  "Fighting Style (Ranger)",
  `At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again.`,
);

export const RangerSpellcasting = new NormalSpellcasting(
  "Ranger",
  `By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does.`,
  "wis",
  "half",
  "Ranger",
  "Ranger",
);

const SpellcastingFocus = notImplementedFeature(
  "Spellcasting Focus",
  `You can use a druidic focus as a spellcasting focus for your ranger spells. A druidic focus might be a sprig of mistletoe or holly, a wand or rod made of yew or another special wood, a staff drawn whole from a living tree, or an object incorporating feathers, fur, bones, and teeth from sacred animals.`,
);

export const Awareness = wrapperFeature(
  "Primeval/Primal Awareness",
  `Choose either Primeval Awareness or Primal Awareness.`,
);

export const PrimevalAwareness = nonCombatFeature(
  "Primeval Awareness",
  `Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn't reveal the creatures' location or number.`,
);

export const PrimalAwareness = notImplementedFeature(
  "Primal Awareness",
  `You can focus your awareness through the interconnections of nature: you learn additional spells when you reach certain levels in this class if you don't already know them, as shown in the Primal Awareness Spells table. These spells don't count against the number of ranger spells you know.

Primal Awareness Spells:
  3rd	speak with animals
  5th	beast sense
  9th	speak with plants
  13th	locate creature
  17th	commune with nature

You can cast each of these spells once without expending a spell slot. Once you cast a spell in this way, you can't do so again until you finish a long rest.`,
);

const MartialVersatility = nonCombatFeature(
  "Martial Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to rangers. This replacement represents a shift of focus in your martial practice.`,
);

const ExtraAttack = makeExtraAttack(
  "Extra Attack",
  `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
);

const Roving = notImplementedFeature(
  "Roving",
  `Your walking speed increases by 5, and you gain a climbing speed and a swimming speed equal to your walking speed.`,
);

const LandsStride = notImplementedFeature(
  "Land's Stride",
  `Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.

In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.`,
);

export const HideVeil = wrapperFeature(
  "Hide in Plain Sight/Nature's Veil",
  `Choose either Hide in Plain Sight or Nature's Veil.`,
);

export const HideInPlainSight = nonCombatFeature(
  "Hide in Plain Sight",
  `Starting at 10th level, you can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage.

Once you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.`,
);

export const NaturesVeil = notImplementedFeature(
  "Nature's Veil",
  `You draw on the powers of nature to hide yourself from view briefly. As a bonus action, you can magically become invisible, along with any equipment you are wearing or carrying, until the start of your next turn.

You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
);

const Tireless = notImplementedFeature(
  "Tireless",
  `As an action, you can give yourself a number of temporary hit points equal to 1d8 + your Wisdom modifier (minimum of 1 temporary hit point). You can use this action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.

In addition, whenever you finish a short rest, your exhaustion level, if any, is decreased by 1.`,
);

const Vanish = notImplementedFeature(
  "Vanish",
  `Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means, unless you choose to leave a trail.`,
);

const FeralSenses = notImplementedFeature(
  "Feral Senses",
  `At 18th level, you gain preternatural senses that help you fight creatures you can't see. When you attack a creature you can't see, your inability to see it doesn't impose disadvantage on your attack rolls against it. You are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn't hidden from you and you aren't blinded or deafened.`,
);

const FoeSlayer = notImplementedFeature(
  "Foe Slayer",
  `At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.`,
);

export const ASI4 = makeASI("Ranger", 4);
export const ASI8 = makeASI("Ranger", 8);
export const ASI12 = makeASI("Ranger", 12);
export const ASI16 = makeASI("Ranger", 16);
export const ASI19 = makeASI("Ranger", 19);

const Ranger: PCClass = {
  name: "Ranger",
  hitDieSize: 10,
  armorProficiencies: acSet("light", "medium", "shield"),
  weaponCategoryProficiencies: wcSet("simple", "martial"),
  saveProficiencies: abSet("str", "dex"),
  skillChoices: 3,
  skillProficiencies: skSet(
    "Animal Handling",
    "Athletics",
    "Insight",
    "Investigation",
    "Nature",
    "Perception",
    "Stealth",
    "Survival",
  ),
  features: new Map([
    [1, [Favored, Explorer]],
    [2, [RangerFightingStyle, RangerSpellcasting.feature, SpellcastingFocus]],
    [3, [Awareness]],
    [4, [ASI4, MartialVersatility]],
    [5, [ExtraAttack]],
    [8, [ASI8, LandsStride]],
    [10, [HideVeil]],
    [12, [ASI12]],
    [14, [Vanish]],
    [16, [ASI16]],
    [18, [FeralSenses]],
    [19, [ASI19]],
    [20, [FoeSlayer]],
  ]),
};
export default Ranger;
