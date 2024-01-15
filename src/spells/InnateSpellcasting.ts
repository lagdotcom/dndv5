import { SpellSlot } from "../flavours";
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
      slot: SpellSlot,
    ) => Resource | undefined = () => undefined,
    public icon?: Icon,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addCastableSpell(): void {}

  getMinSlot(spell: Spell) {
    return spell.level as SpellSlot;
  }

  getMaxSlot(spell: Spell) {
    return spell.level as SpellSlot;
  }

  getSaveType(): SaveType {
    return { type: "ability", ability: this.ability };
  }
}
