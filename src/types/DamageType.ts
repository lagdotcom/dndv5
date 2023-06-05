export const DamageTypes = [
  "acid",
  "bludgeoning",
  "cold",
  "fire",
  "force",
  "lightning",
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

export const MundaneDamageTypes: DamageType[] = [
  "bludgeoning",
  "piercing",
  "slashing",
];
