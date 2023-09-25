export const EffectTags = ["disease", "poison", "possession"] as const;
export type EffectTag = (typeof EffectTags)[number];
export const efSet = (...items: EffectTag[]) => new Set(items);
