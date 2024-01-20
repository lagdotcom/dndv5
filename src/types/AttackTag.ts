export const AttackTags = [
  "breath weapon",
  "magical",
  "melee",
  "opportunity",
  "ranged",
  "silvered",
  "spell",
  "thrown",
  "two-weapon",
  "two hands",
  "versatile",
  "weapon",
] as const;
type AttackTag = (typeof AttackTags)[number];
export default AttackTag;
export const atSet = (...items: AttackTag[]) => new Set(items);
