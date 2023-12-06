export const MundaneDifficultTerrainTypes = [
  "ice",
  "plants",
  "rubble",
  "snow",
  "webs",
] as const;
export const MagicalDifficultTerrainTypes = [
  "magical ice",
  "magical plants",
  "magical rubble", // ???
  "magical snow",
  "magical webs",
] as const;

export const DifficultTerrainTypes = [
  ...MundaneDifficultTerrainTypes,
  ...MagicalDifficultTerrainTypes,
] as const;
type DifficultTerrainType = (typeof DifficultTerrainTypes)[number];
export default DifficultTerrainType;
