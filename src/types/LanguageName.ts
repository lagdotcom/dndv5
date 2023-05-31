export const LanguageNames = [
  "Common",
  "Draconic",
  "Elvish",
  "Infernal",
  "Primordial",
  "Sylvan",
] as const;
type LanguageName = (typeof LanguageNames)[number];
export default LanguageName;
