import { PickChoice } from "../interruptions/PickFromListChoice";
import AbilityName from "../types/AbilityName";
import SkillName from "../types/SkillName";

export type GrappleChoice = { ability: AbilityName; skill: SkillName };

export const GrappleChoices: PickChoice<GrappleChoice>[] = [
  {
    label: "Strength (Athletics)",
    value: { ability: "str", skill: "Athletics" },
  },
  {
    label: "Dexterity (Acrobatics)",
    value: { ability: "dex", skill: "Acrobatics" },
  },
];
