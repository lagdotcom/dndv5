export const ActionTimes = ["action", "bonus action", "reaction"] as const;
export type ActionTime = (typeof ActionTimes)[number];
