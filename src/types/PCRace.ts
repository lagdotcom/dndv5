import { Feet, Modifier } from "../flavours";
import AbilityName from "./AbilityName";
import { CombatantTag } from "./CombatantTag";
import Feature from "./Feature";
import LanguageName from "./LanguageName";
import MovementType from "./MovementType";
import SizeCategory from "./SizeCategory";
import Source from "./Source";

export default interface PCRace extends Source {
  parent?: PCRace;
  abilities?: Map<AbilityName, Modifier>;
  size: SizeCategory;
  movement?: Map<MovementType, Feet>;
  features?: Set<Feature>;
  languages?: Set<LanguageName>;
  tags?: Set<CombatantTag>;
}
