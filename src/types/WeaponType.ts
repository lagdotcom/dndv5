export const SimpleMeleeWeapons = [
  "club",
  "dagger",
  "greatclub",
  "handaxe",
  "javelin",
  "light hammer",
  "mace",
  "quarterstaff",
  "sickle",
  "spear",
] as const;

export const SimpleRangedWeapons = [
  "light crossbow",
  "dart",
  "shortbow",
  "sling",
] as const;

export const MartialMeleeWeapons = [
  "battleaxe",
  "flail",
  "glaive",
  "greataxe",
  "greatsword",
  "halberd",
  "lance",
  "longsword",
  "maul",
  "morningstar",
  "pike",
  "rapier",
  "scimitar",
  "shortsword",
  "trident",
  "war pick",
  "warhammer",
  "whip",
] as const;

export const MartialRangedWeapons = [
  "blowgun",
  "hand crossbow",
  "heavy crossbow",
  "longbow",
  "net",
] as const;

export const WeaponTypes = [
  ...SimpleMeleeWeapons,
  ...SimpleRangedWeapons,
  ...MartialMeleeWeapons,
  ...MartialRangedWeapons,
  "unarmed strike",
] as const;
type WeaponType = (typeof WeaponTypes)[number];
export default WeaponType;
export const wtSet = (...items: WeaponType[]) => new Set(items);
