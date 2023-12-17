export const MundaneDamageTypes = [
  "bludgeoning",
  "piercing",
  "slashing",
] as const;
export type MundaneDamageType = (typeof MundaneDamageTypes)[number];

export const MagicDamageTypes = [
  "acid",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "poison",
  "psychic",
  "radiant",
  "thunder",
] as const;
export type MagicDamageType = (typeof MagicDamageTypes)[number];

export const DamageTypes = [
  ...MundaneDamageTypes,
  ...MagicDamageTypes,
] as const;
type DamageType = (typeof DamageTypes)[number];
export default DamageType;
