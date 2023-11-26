export const ProficiencyTypes = [
  "none",
  "half",
  "proficient",
  "expertise",
] as const;
type ProficiencyType = (typeof ProficiencyTypes)[number];
export default ProficiencyType;
