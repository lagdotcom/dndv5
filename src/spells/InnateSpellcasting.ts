import AbilityName from "../types/AbilityName";
import { ActionIcon } from "../types/Action";
import Combatant from "../types/Combatant";
import Resource from "../types/Resource";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { getSaveDC } from "../utils/dnd";

export default class InnateSpellcasting implements SpellcastingMethod {
  constructor(
    public name: string,
    public ability: AbilityName,
    public getResourceForSpell: (
      spell: Spell,
      level: number,
    ) => Resource | undefined,
    public icon?: ActionIcon,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addCastableSpell(): void {}

  getMinSlot(spell: Spell): number {
    return spell.level;
  }

  getMaxSlot(spell: Spell): number {
    return spell.level;
  }

  getSaveDC(caster: Combatant): number {
    return getSaveDC(caster, this.ability);
  }
}
