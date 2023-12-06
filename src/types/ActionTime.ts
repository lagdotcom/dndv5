export const ActionTimes = [
  "item interaction",
  "action",
  "bonus action",
  "reaction",
  "long",
] as const;
type ActionTime = (typeof ActionTimes)[number];
export default ActionTime;
