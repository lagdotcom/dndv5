export const DamageResponses = [
  "absorb",
  "immune",
  "resist",
  "vulnerable",
  "normal",
] as const;
type DamageResponse = (typeof DamageResponses)[number];
export default DamageResponse;
