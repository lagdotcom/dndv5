export const PhysicalAbilities = ["str", "dex", "con"] as const;
export const MentalAbilities = ["int", "wis", "cha"] as const;

export const AbilityNames = [...PhysicalAbilities, ...MentalAbilities] as const;
type AbilityName = (typeof AbilityNames)[number];
export default AbilityName;
export const abSet = (...items: AbilityName[]) => new Set(items);
