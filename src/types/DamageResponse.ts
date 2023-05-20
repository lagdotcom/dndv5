export const DamageResponses = [
  "absorb",
  "immune",
  "resist",
  "normal",
  "vulnerable",
] as const;
export type DamageResponse = (typeof DamageResponses)[number];
