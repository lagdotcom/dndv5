export const CombatantTags = ["dwarf", "shapechanger"] as const;
export type CombatantTag = (typeof CombatantTags)[number];
export const coSet = (...items: CombatantTag[]) => new Set(items);
