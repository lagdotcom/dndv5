export const ActionTimes = [
  "action",
  "bonus action",
  "reaction",
  "long",
] as const;
type ActionTime = (typeof ActionTimes)[number];
export default ActionTime;
