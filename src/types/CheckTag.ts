export const CheckTags = ["counterspell", "hearing", "sight", "smell"] as const;
export type CheckTag = (typeof CheckTags)[number];
export const chSet = (...items: CheckTag[]) => new Set(items);
