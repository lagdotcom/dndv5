export const SkillNames = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival",
] as const;
type SkillName = (typeof SkillNames)[number];
export default SkillName;
export const skSet = (...items: SkillName[]) => new Set(items);
