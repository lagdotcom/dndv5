export const SaveTags = [
  "charm",
  "concentration",
  "death",
  "disease",
  "forced movement",
  "frightened",
  "magic",
  "poison",
] as const;
type SaveTag = (typeof SaveTags)[number];
export default SaveTag;
export const svSet = (...items: SaveTag[]) => new Set(items);
