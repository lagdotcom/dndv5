export const LanguageNames = [
  "Abyssal",
  "Common",
  "Draconic",
  "Dwarvish",
  "Elvish",
  "Giant",
  "Gnomish",
  "Goblin",
  "Halfling",
  "Infernal",
  "Orc",
  "Primordial",
  "Sylvan",
] as const;
type LanguageName = (typeof LanguageNames)[number];
export default LanguageName;
export const laSet = (...items: LanguageName[]) => new Set(items);
