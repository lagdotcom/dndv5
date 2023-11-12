export const CheckTags = [
  "counterspell",
  "hearing",
  "sight",
  "smell",
  "social",
] as const;
export type CheckTag = (typeof CheckTags)[number];
export const chSet = (...items: CheckTag[]) => new Set(items);
