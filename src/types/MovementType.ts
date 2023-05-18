export const MovementTypes = ["speed", "burrow"] as const;
type MovementType = (typeof MovementTypes)[number];
export default MovementType;
