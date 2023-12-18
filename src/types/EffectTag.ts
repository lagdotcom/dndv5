export const EffectTags = [
  "disease",
  "fire",
  "magic",
  "poison",
  "possession",
  "shapechange",
  "sleep",
] as const;
export type EffectTag = (typeof EffectTags)[number];
export const efSet = (...items: EffectTag[]) => new Set(items);
