export const SenseNames = ["darkvision"] as const;
type SenseName = (typeof SenseNames)[number];
export default SenseName;
