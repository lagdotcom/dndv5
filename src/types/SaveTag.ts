export const SaveTags = ["disease", "frightened", "poison"] as const;
type SaveTag = (typeof SaveTags)[number];
export default SaveTag;
