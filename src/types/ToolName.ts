export const ToolNames = ["thieves' tools"] as const;
type ToolName = (typeof ToolNames)[number];
export default ToolName;
