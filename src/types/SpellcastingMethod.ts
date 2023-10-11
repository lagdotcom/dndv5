import AbilityName from "./AbilityName";
import Combatant from "./Combatant";
import Icon from "./Icon";
import Resource from "./Resource";
import Source from "./Source";
import Spell from "./Spell";

export default interface SpellcastingMethod extends Source {
  ability?: AbilityName;
  icon?: Icon;

  addCastableSpell?(spell: Spell, caster: Combatant): void;
  getMinSlot?(spell: Spell, caster: Combatant): number;
  getMaxSlot?(spell: Spell, caster: Combatant): number;
  getResourceForSpell(
    spell: Spell,
    level: number,
    caster: Combatant,
  ): Resource | undefined;
  getSaveDC(caster: Combatant, spell: Spell, level?: number): number;
}
