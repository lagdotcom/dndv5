import Ability from "./Ability";
import Feature from "./Feature";
import LanguageName from "./LanguageName";
import MovementType from "./MovementType";
import SizeCategory from "./SizeCategory";

export default interface PCRace {
  parent?: PCRace;
  name: string;
  abilities: Map<Ability, number>;
  size: SizeCategory;
  movement: Map<MovementType, number>;
  features: Set<Feature>;
  languages: Set<LanguageName>;
}
