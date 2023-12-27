import { defaultAIRules } from "./ai/data";
import CombatantBase from "./CombatantBase";
import Engine from "./Engine";
import AIRule from "./types/AIRule";
import CreatureType from "./types/CreatureType";
import Item from "./types/Item";
import SizeCategory from "./types/SizeCategory";

export default class Monster extends CombatantBase {
  constructor(
    g: Engine,
    name: string,
    cr: number,
    type: CreatureType,
    size: SizeCategory,
    img: string,
    hpMax: number,
    rules: AIRule[] = defaultAIRules,
  ) {
    super(g, name, {
      type,
      size,
      img,
      side: 1,
      cr,
      hpMax,
      rules,
    });
  }

  don(item: Item, giveProficiency = false) {
    if (giveProficiency) this.addProficiency(item, "proficient");
    return super.don(item);
  }

  give(item: Item, giveProficiency = false) {
    if (giveProficiency) this.addProficiency(item, "proficient");
    return this.addToInventory(item);
  }
}
