import { darkvisionFeature } from "../features/common";
import ConfiguredFeature from "../features/ConfiguredFeature";
import SimpleFeature from "../features/SimpleFeature";
import AbilityName from "../types/AbilityName";
import LanguageName, { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import SkillName from "../types/SkillName";

const Darkvision = darkvisionFeature(60);

const FeyAncestry = new SimpleFeature(
  "Fey Ancestry",
  `You have advantage on saving throws against being charmed, and magic can't put you to sleep.`,
  (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, config, diceType } }) => {
      if (who === me && config?.conditions?.has("Charmed"))
        diceType.add("advantage", FeyAncestry);
    });

    g.events.on("BeforeEffect", ({ detail: { who, effect, success } }) => {
      if (who === me && effect.tags.has("magic") && effect.tags.has("sleep"))
        success.add("fail", FeyAncestry);
    });
  },
);

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

export const LanguageChoice = new ConfiguredFeature<LanguageName>(
  "Language Choice",
  ``,
  (g, me, language) => {
    me.languages.add(language);
  },
);

export const HalfElf: PCRace = {
  name: "Half-Elf",
  abilities: new Map([["cha", 2]]),
  size: "medium",
  movement: new Map([["speed", 30]]),
  features: new Set([
    Darkvision,
    FeyAncestry,
    SkillVersatility,
    AbilityScoreBonus,
    LanguageChoice,
  ]),
  languages: laSet("Common", "Elvish"),
};
