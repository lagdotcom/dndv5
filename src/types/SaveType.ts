import { DifficultyClass } from "../flavours";
import AbilityName from "./AbilityName";

type SaveType =
  | { type: "ability"; ability: AbilityName }
  | { type: "flat"; dc: DifficultyClass };
export default SaveType;
