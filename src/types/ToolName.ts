export const ToolNames = [
  "dice set",
  "horn",
  "playing card set",
  "thieves' tools",
] as const;
type ToolName = (typeof ToolNames)[number];
export default ToolName;
