import AbilityName from "../types/AbilityName";
import Icon from "../types/Icon";
import Resource from "../types/Resource";
import SaveType from "../types/SaveType";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class InnateSpellcasting implements SpellcastingMethod {
  constructor(
    public name: string,
    public ability: AbilityName,
    public getResourceForSpell: (
      spell: Spell,
      level: number,
    ) => Resource | undefined = () => undefined,
    public icon?: Icon,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addCastableSpell(): void {}

  getMinSlot(spell: Spell): number {
    return spell.level;
  }

  getMaxSlot(spell: Spell): number {
    return spell.level;
  }

  getSaveType(): SaveType {
    return { type: "ability", ability: this.ability };
  }
}
