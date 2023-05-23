import Ability from "./Ability";
import Spell from "./Spell";

interface SpellcastingMethod {
  ability: Ability;
  name: string;

  getMaxSlot(spell: Spell): number;
}
export default SpellcastingMethod;
