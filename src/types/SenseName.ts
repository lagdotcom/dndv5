export const SenseNames = [
  "blindsight",
  "darkvision",
  "tremorsense",
  "truesight",
] as const;
type SenseName = (typeof SenseNames)[number];
export default SenseName;
