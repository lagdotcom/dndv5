export const AttackTags = [
  "magical",
  "melee",
  "ranged",
  "silvered",
  "spell",
  "thrown",
  "two-weapon",
  "weapon",
] as const;
type AttackTag = (typeof AttackTags)[number];
export default AttackTag;
export const atSet = (...items: AttackTag[]) => new Set(items);
