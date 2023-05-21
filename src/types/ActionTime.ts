export const ActionTimes = ["action", "bonus action", "reaction"] as const;
type ActionTime = (typeof ActionTimes)[number];
export default ActionTime;
