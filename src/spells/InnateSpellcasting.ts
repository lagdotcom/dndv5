import Ability from "../types/Ability";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class InnateSpellcasting implements SpellcastingMethod {
  constructor(public name: string, public ability: Ability) {}
}
