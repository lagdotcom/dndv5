export const MovementTypes = ["speed", "burrow", "swim"] as const;
type MovementType = (typeof MovementTypes)[number];
export default MovementType;
