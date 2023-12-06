export const CheckTags = [
  "counterspell",
  "grapple",
  "hearing",
  "sight",
  "smell",
  "social",
] as const;
export type CheckTag = (typeof CheckTags)[number];
export const chSet = (...items: CheckTag[]) => new Set(items);
