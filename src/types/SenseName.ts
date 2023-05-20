export const SenseNames = ["blindsight", "darkvision", "truesight"] as const;
type SenseName = (typeof SenseNames)[number];
export default SenseName;
