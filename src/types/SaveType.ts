import AbilityName from "./AbilityName";

type SaveType =
  | { type: "ability"; ability: AbilityName }
  | { type: "flat"; dc: number };
export default SaveType;
