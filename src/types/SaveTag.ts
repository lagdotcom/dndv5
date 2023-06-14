import ConditionName from "./ConditionName";

export const SaveTags = [
  "disease",
  "forced movement",
  "frightened",
  "poison",
] as const;
type SaveTag = (typeof SaveTags)[number] | ConditionName;
export default SaveTag;
