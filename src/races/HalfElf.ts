import { Darkvision60 } from "../features/common";
import ConfiguredFeature from "../features/ConfiguredFeature";
import AbilityName from "../types/AbilityName";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import SkillName from "../types/SkillName";
import { ExtraLanguage, FeyAncestry } from "./common";

export const SkillVersatility = new ConfiguredFeature<SkillName[]>(
  "Skill Versatility",
  `You gain proficiency in two skills of your choice.`,
  (g, me, skills) => {
    for (const skill of skills) me.addProficiency(skill, "proficient");
  },
);

export const AbilityScoreBonus = new ConfiguredFeature<AbilityName[]>(
  "Ability Score Bonus",
  ``,
  (g, me, abilities) => {
    for (const ability of abilities) me[ability].score++;
  },
);

export const HalfElf: PCRace = {
  name: "Half-Elf",
  abilities: new Map([["cha", 2]]),
  size: "medium",
  movement: new Map([["speed", 30]]),
  features: new Set([
    Darkvision60,
    FeyAncestry,
    SkillVersatility,
    AbilityScoreBonus,
    ExtraLanguage,
  ]),
  languages: laSet("Common", "Elvish"),
};
