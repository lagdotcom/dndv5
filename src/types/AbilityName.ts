export const AbilityNames = ["str", "dex", "con", "int", "wis", "cha"] as const;
type AbilityName = (typeof AbilityNames)[number];
export default AbilityName;
export const abSet = (...items: AbilityName[]) => new Set(items);
