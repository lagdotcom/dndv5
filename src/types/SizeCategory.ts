export const SizeCategories = [
  "tiny",
  "small",
  "medium",
  "large",
  "huge",
  "gargantuan",
] as const;
type SizeCategory = (typeof SizeCategories)[number];
export default SizeCategory;
