import { SpellSlot } from "../flavours";
import AbilityName from "./AbilityName";
import Combatant from "./Combatant";
import Icon from "./Icon";
import Resource from "./Resource";
import SaveType from "./SaveType";
import Source from "./Source";
import Spell from "./Spell";

export default interface SpellcastingMethod extends Source {
  ability?: AbilityName;
  icon?: Icon;

  addCastableSpell?(spell: Spell, caster: Combatant): void;
  getMinSlot?(spell: Spell, caster: Combatant): SpellSlot;
  getMaxSlot?(spell: Spell, caster: Combatant): SpellSlot;
  getResourceForSpell(
    spell: Spell,
    slot: SpellSlot,
    caster: Combatant,
  ): Resource | undefined;
  getSaveType(caster: Combatant, spell?: Spell, slot?: SpellSlot): SaveType;
}
