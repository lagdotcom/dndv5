import AbilityName from "./AbilityName";
import { ActionIcon } from "./Action";
import Combatant from "./Combatant";
import Resource from "./Resource";
import Source from "./Source";
import Spell from "./Spell";

export default interface SpellcastingMethod extends Source {
  ability: AbilityName;
  icon?: ActionIcon;

  addCastableSpell(spell: Spell, caster: Combatant): void;
  getMinSlot(spell: Spell, caster: Combatant): number;
  getMaxSlot(spell: Spell, caster: Combatant): number;
  getResourceForSpell(
    spell: Spell,
    level: number,
    caster: Combatant
  ): Resource | undefined;
}
