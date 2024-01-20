import { makeChoice } from "../interruptions/PickFromListChoice";
import AbilityName from "../types/AbilityName";
import SkillName from "../types/SkillName";

export interface GrappleChoice {
  ability: AbilityName;
  skill: SkillName;
}

export const GrappleChoices = [
  makeChoice<GrappleChoice>(
    { ability: "str", skill: "Athletics" },
    "Strength (Athletics)",
  ),
  makeChoice<GrappleChoice>(
    { ability: "dex", skill: "Acrobatics" },
    "Dexterity (Acrobatics)",
  ),
];
