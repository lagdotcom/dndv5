export const ArtisansTools = [
  "alchemist's supplies",
  "brewer's supplies",
  "calligrapher's supplies",
  "carpenter's tools",
  "cartographer's tools",
  "cobbler's tools",
  "cook's utensils",
  "glassblower's tools",
  "jeweler's tools",
  "leatherworker's tools",
  "mason's tools",
  "painter's supplies",
  "potter's tools",
  "smith's tools",
  "tinker's tools",
  "weaver's tools",
  "woodcarver's tools",
] as const;

export const GamingSets = [
  "dice set",
  "dragonchess set",
  "playing card set",
  "three-dragon ante set",
] as const;

export const Instruments = [
  "bagpipes",
  "birdpipes",
  "drum",
  "dulcimer",
  "flute",
  "glaur",
  "hand drum",
  "horn",
  "longhorn",
  "lute",
  "lyre",
  "pan flute",
  "shawm",
  "songborn",
  "tantan",
  "thelarr",
  "tocken",
  "viol",
  "wargong",
  "yarting",
  "zulkoon",
] as const;

export const VehicleTypes = [
  "vehicles (air)",
  "vehicles (land)",
  "vehicles (space)",
  "vehicles (water)",
] as const;

export const ToolNames = [
  ...ArtisansTools,
  ...GamingSets,
  ...Instruments,
  ...VehicleTypes,
  "disguise kit",
  "forgery kit",
  "herbalism kit",
  "navigator's tools",
  "poisoner's kit",
  "thieves' tools",
] as const;
type ToolName = (typeof ToolNames)[number];
export default ToolName;
export const toSet = (...items: ToolName[]) => new Set(items);
