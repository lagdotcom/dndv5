export const CombatantTags = ["dwarf"] as const;
export type CombatantTag = (typeof CombatantTags)[number];
export const coSet = (...items: CombatantTag[]) => new Set(items);
