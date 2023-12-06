export const SaveTags = [
  "charm",
  "concentration",
  "death",
  "disease",
  "forced movement",
  "frightened",
  "impedes movement",
  "magic",
  "plant",
  "poison",
] as const;
type SaveTag = (typeof SaveTags)[number];
export default SaveTag;
export const svSet = (...items: SaveTag[]) => new Set(items);
