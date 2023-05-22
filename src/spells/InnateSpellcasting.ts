import Ability from "../types/Ability";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class InnateSpellcasting implements SpellcastingMethod {
  constructor(public name: string, public ability: Ability) {}

  getMaxSlot(spell: Spell): number {
    return spell.level;
  }
}
