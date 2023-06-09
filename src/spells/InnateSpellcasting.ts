import AbilityName from "../types/AbilityName";
import { ActionIcon } from "../types/Action";
import Resource from "../types/Resource";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class InnateSpellcasting implements SpellcastingMethod {
  constructor(
    public name: string,
    public ability: AbilityName,
    public getResourceForSpell: (
      spell: Spell,
      level: number
    ) => Resource | undefined,
    public icon?: ActionIcon
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addCastableSpell(): void {}

  getMinSlot(spell: Spell): number {
    return spell.level;
  }

  getMaxSlot(spell: Spell): number {
    return spell.level;
  }
}
