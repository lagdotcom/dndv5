import Ability from "./Ability";
import Spell from "./Spell";

interface SpellcastingMethod {
  ability: Ability;
  getMaxSlot(spell: Spell): number;
  name: string;
}
export default SpellcastingMethod;
