import Ability from "../types/Ability";
import Resource from "../types/Resource";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class InnateSpellcasting implements SpellcastingMethod {
  constructor(
    public name: string,
    public ability: Ability,
    public getResourceForSpell: (
      spell: Spell,
      level: number
    ) => Resource | undefined
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
