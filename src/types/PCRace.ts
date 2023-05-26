import Ability from "./Ability";
import Feature from "./Feature";
import LanguageName from "./LanguageName";
import MovementType from "./MovementType";
import SizeCategory from "./SizeCategory";
import Source from "./Source";

export default interface PCRace extends Source {
  parent?: PCRace;
  abilities: Map<Ability, number>;
  size: SizeCategory;
  movement?: Map<MovementType, number>;
  features?: Set<Feature>;
  languages?: Set<LanguageName>;
}
