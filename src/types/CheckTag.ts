export const CheckTags = ["smell"] as const;
export type CheckTag = (typeof CheckTags)[number];
