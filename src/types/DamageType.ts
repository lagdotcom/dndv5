export const DamageTypes = [
  "bludgeoning",
  "cold",
  "fire",
  "force",
  "necrotic",
  "piercing",
  "poison",
  "psychic",
  "radiant",
  "slashing",
  "thunder",
] as const;
type DamageType = (typeof DamageTypes)[number];
export default DamageType;
