export const GEAlignments = ["Good", "Neutral", "Evil"] as const;
export type GEAlignment = (typeof GEAlignments)[number];

export const LCAlignments = ["Lawful", "Neutral", "Chaotic"] as const;
export type LCAlignment = (typeof LCAlignments)[number];

export type AlignmentPair = [LCAlignment, GEAlignment];
