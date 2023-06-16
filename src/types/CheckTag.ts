export const CheckTags = ["counterspell", "smell"] as const;
export type CheckTag = (typeof CheckTags)[number];
