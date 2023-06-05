import { notImplementedFeature } from "../../features/common";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import SimpleFeature from "../../features/SimpleFeature";
import Item from "../../types/Item";
import PCClass from "../../types/PCClass";
import SkillName from "../../types/SkillName";
import { makeASI } from "../common";
import Rage from "./Rage";

const UnarmoredDefense = new SimpleFeature(
  "Unarmored Defense",
  `While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.`,
  (g, me) => {
    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
      if (who === me && !me.armor) {
        const uses = new Set<Item>();
        let ac = 10 + me.dex.bonus + me.con.bonus;

        if (me.shield) {
          ac += me.shield.ac;
          uses.add(me.shield);
        }

        methods.push({ name: "Unarmored Defense", ac, uses });
      }
    });
  }
);

// TODO
const DangerSense = notImplementedFeature(
  "Danger Sense",
  `At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.`
);

// TODO
const RecklessAttack = notImplementedFeature(
  "Reckless Attack",
  `Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.`
);

export const PrimalKnowledge = new ConfiguredFeature<SkillName[]>(
  "Primal Knowledge",
  `When you reach 3rd level and again at 10th level, you gain proficiency in one skill of your choice from the list of skills available to barbarians at 1st level.`,
  (g, me, skills) => {
    for (const skill of skills) me.skills.set(skill, 1);
  }
);

// TODO
const ExtraAttack = notImplementedFeature(
  "Extra Attack",
  `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`
);

const FastMovement = new SimpleFeature(
  "Fast Movement",
  `Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor.`,
  (g, me) => {
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who === me && me.armor?.category !== "heavy")
        bonus.add(10, FastMovement);
    });
  }
);

// TODO
const FeralInstinct = notImplementedFeature(
  "Feral Instinct",
  `By 7th level, your instincts are so honed that you have advantage on initiative rolls.

Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.`
);

// TODO
const InstinctivePounce = notImplementedFeature(
  "Instinctive Pounce",
  `As part of the bonus action you take to enter your rage, you can move up to half your speed.`
);

// TODO
const BrutalCritical = notImplementedFeature(
  "Brutal Critical",
  `Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.

This increases to two additional dice at 13th level and three additional dice at 17th level.`
);

// TODO
const RelentlessRage = notImplementedFeature(
  "Relentless Rage",
  `Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.

Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.`
);

// TODO
const PersistentRage = notImplementedFeature(
  "Persistent Rage",
  `Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.`
);

// TODO
const IndomitableMight = notImplementedFeature(
  "Indomitable Might",
  `Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.`
);

// TODO
const PrimalChampion = notImplementedFeature(
  "Primal Champion",
  `At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.`
);

export const ASI4 = makeASI("Barbarian", 4);
export const ASI8 = makeASI("Barbarian", 8);
export const ASI12 = makeASI("Barbarian", 12);
export const ASI16 = makeASI("Barbarian", 16);
export const ASI19 = makeASI("Barbarian", 19);

const Barbarian: PCClass = {
  name: "Barbarian",
  hitDieSize: 12,
  armorProficiencies: new Set(["light", "medium", "shield"]),
  weaponCategoryProficiencies: new Set(["simple", "martial"]),
  saveProficiencies: new Set(["str", "con"]),
  skillChoices: 2,
  skillProficiencies: new Set([
    "Animal Handling",
    "Athletics",
    "Intimidation",
    "Nature",
    "Perception",
    "Survival",
  ]),
  features: new Map([
    [1, [Rage, UnarmoredDefense]],
    [2, [DangerSense, RecklessAttack]],
    [3, [PrimalKnowledge]],
    [4, [ASI4]],
    [5, [ExtraAttack, FastMovement]],
    [7, [FeralInstinct, InstinctivePounce]],
    [8, [ASI8]],
    [9, [BrutalCritical]],
    [11, [RelentlessRage]],
    [12, [ASI12]],
    [15, [PersistentRage]],
    [16, [ASI16]],
    [18, [IndomitableMight]],
    [19, [ASI19]],
    [20, [PrimalChampion]],
  ]),
};
export default Barbarian;