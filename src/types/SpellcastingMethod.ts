import Ability from "./Ability";
import Resource from "./Resource";
import Source from "./Source";
import Spell from "./Spell";

export default interface SpellcastingMethod extends Source {
  ability: Ability;

  getMinSlot(spell: Spell): number;
  getMaxSlot(spell: Spell): number;
  getResourceForSpell(spell: Spell): Resource | undefined;
}
