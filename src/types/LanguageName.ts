export const LanguageNames = [
  "Common",
  "Draconic",
  "Dwarvish",
  "Elvish",
  "Giant",
  "Halfling",
  "Infernal",
  "Primordial",
  "Sylvan",
] as const;
type LanguageName = (typeof LanguageNames)[number];
export default LanguageName;
