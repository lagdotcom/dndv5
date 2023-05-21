export const DamageResponses = [
  "absorb",
  "immune",
  "resist",
  "normal",
  "vulnerable",
] as const;
type DamageResponse = (typeof DamageResponses)[number];
export default DamageResponse;
