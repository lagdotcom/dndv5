export const LanguageNames = ["common"] as const;
type LanguageName = (typeof LanguageNames)[number];
export default LanguageName;
