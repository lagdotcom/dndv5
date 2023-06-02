export const ToolNames = [
  "brewer's supplies",
  "dice set",
  "herbalism kit",
  "horn",
  "mason's tools",
  "playing card set",
  "smith's tools",
  "thieves' tools",
] as const;
type ToolName = (typeof ToolNames)[number];
export default ToolName;
