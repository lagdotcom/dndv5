export const LanguageNames = ["Common", "Draconic", "Primordial"] as const;
type LanguageName = (typeof LanguageNames)[number];
export default LanguageName;
