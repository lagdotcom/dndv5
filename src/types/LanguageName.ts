export const StandardLanguages = [
  "Common",
  "Dwarvish",
  "Elvish",
  "Giant",
  "Gnomish",
  "Goblin",
  "Halfling",
  "Orc",
] as const;

export const ExoticLanguages = [
  "Abyssal",
  "Celestial",
  "Draconic",
  "Deep Speech",
  "Infernal",
  "Primordial",
  "Sylvan",
  "Undercommon",
] as const;

export const PrimordialDialects = [
  "Aquan",
  "Auran",
  "Ignan",
  "Terran",
] as const;

export const LanguageNames = [
  ...StandardLanguages,
  ...ExoticLanguages,
  ...PrimordialDialects,
] as const;
type LanguageName = (typeof LanguageNames)[number];
export default LanguageName;
export const laSet = (...items: LanguageName[]) => new Set(items);
