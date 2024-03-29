import { nonCombatFeature, wrapperFeature } from "../../features/common";
import { abSet } from "../../types/AbilityName";
import { acSet, wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import { gains } from "../../utils/gain";
import { makeASI, makeExtraAttack } from "../common";
import ActionSurge from "./ActionSurge";
import Indomitable from "./Indomitable";
import SecondWind from "./SecondWind";

export const FighterFightingStyle = wrapperFeature(
  "Fighting Style (Fighter)",
  `You adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take the same Fighting Style option more than once, even if you get to choose again.`,
);

const ExtraAttack = makeExtraAttack(
  "Extra Attack",
  `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
);
const ExtraAttack2 = makeExtraAttack(
  "Extra Attack (2)",
  `At 11th level, you can attack three times whenever you take the Attack action on your turn.`,
  2,
);
const ExtraAttack3 = makeExtraAttack(
  "Extra Attack (3)",
  `At 20th level, you can attack four times whenever you take the Attack action on your turn.`,
  3,
);

const MartialVersatility = nonCombatFeature(
  "Martial Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, as you shift the focus of your martial practice:
- Replace a fighting style you know with another fighting style available to fighters.
- If you know any maneuvers from the Battle Master archetype, you can replace one maneuver you know with a different maneuver.`,
);

export const ASI4 = makeASI("Fighter", 4);
export const ASI6 = makeASI("Fighter", 6);
export const ASI8 = makeASI("Fighter", 8);
export const ASI12 = makeASI("Fighter", 12);
export const ASI14 = makeASI("Fighter", 14);
export const ASI16 = makeASI("Fighter", 16);
export const ASI19 = makeASI("Fighter", 19);

const Fighter: PCClass = {
  name: "Fighter",
  hitDieSize: 10,
  armor: acSet("light", "medium", "heavy", "shield"),
  weaponCategory: wcSet("simple", "martial"),
  save: abSet("str", "con"),
  skill: gains([], 2, [
    "Acrobatics",
    "Animal Handling",
    "Athletics",
    "History",
    "Insight",
    "Intimidation",
    "Perception",
    "Survival",
  ]),
  multi: {
    // TODO Strength 13 or Dexterity 13
    requirements: new Map([["str", 13]]),
    armor: acSet("light", "medium", "shield"),
    weaponCategory: wcSet("simple", "martial"),
  },

  features: new Map([
    [1, [FighterFightingStyle, SecondWind]],
    [2, [ActionSurge]],
    [4, [ASI4, MartialVersatility]],
    [5, [ExtraAttack]],
    [6, [ASI6]],
    [8, [ASI8]],
    [9, [Indomitable]],
    [11, [ExtraAttack2]],
    [12, [ASI12]],
    [14, [ASI14]],
    [16, [ASI16]],
    [19, [ASI19]],
    [20, [ExtraAttack3]],
  ]),
};
export default Fighter;
