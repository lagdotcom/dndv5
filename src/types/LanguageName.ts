export const LanguageNames = ["Common", "Primordial"] as const;
type LanguageName = (typeof LanguageNames)[number];
export default LanguageName;
