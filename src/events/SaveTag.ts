export const SaveTags = ["disease", "poison"] as const;
type SaveTag = (typeof SaveTags)[number];
export default SaveTag;
