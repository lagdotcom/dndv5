export const MovementTypes = ["speed", "burrow", "swim", "fly"] as const;
type MovementType = (typeof MovementTypes)[number];
export default MovementType;
