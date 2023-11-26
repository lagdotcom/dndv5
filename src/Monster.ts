import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";
import AIRule from "./types/AIRule";
import CreatureType from "./types/CreatureType";
import Item from "./types/Item";
import SizeCategory from "./types/SizeCategory";

export default class Monster extends AbstractCombatant {
  constructor(
    g: Engine,
    name: string,
    public cr: number,
    type: CreatureType,
    size: SizeCategory,
    img: string,
    hpMax: number,
    rules: AIRule[] = [],
  ) {
    super(g, name, {
      type,
      size,
      img,
      side: 1,
      hpMax,
      rules,
    });
  }

  don(item: Item, giveProficiency = false): void {
    super.don(item);
    if (giveProficiency) this.addProficiency(item, "proficient");
  }
}
