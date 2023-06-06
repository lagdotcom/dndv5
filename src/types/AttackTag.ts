export const AttackTags = [
  "magical",
  "melee",
  "ranged",
  "spell",
  "weapon",
] as const;
type AttackTag = (typeof AttackTags)[number];
export default AttackTag;
