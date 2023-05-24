import Ability from "./Ability";
import Resource from "./Resource";
import Spell from "./Spell";

export default interface SpellcastingMethod {
  ability: Ability;
  name: string;

  getMaxSlot(spell: Spell): number;
  getResourceForSpell(spell: Spell): Resource | undefined;
}
