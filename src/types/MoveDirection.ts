export const MoveDirections = [
  "east",
  "southeast",
  "south",
  "southwest",
  "west",
  "northwest",
  "north",
  "northeast",
] as const;
type MoveDirection = (typeof MoveDirections)[number];
export default MoveDirection;
