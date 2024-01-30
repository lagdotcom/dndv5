export const CombatantTags = ["dwarf", "shapechanger"] as const;
export type CombatantTag = (typeof CombatantTags)[number];
export const cmSet = (...items: CombatantTag[]) => new Set(items);
