import { defaultAIRules } from "./ai/data";
import CombatantBase from "./CombatantBase";
import { ItemName } from "./data/allItems";
import Engine from "./Engine";
import { ChallengeRating, HitPoints, Quantity, Url } from "./flavours";
import AIRule from "./types/AIRule";
import CreatureType from "./types/CreatureType";
import Item from "./types/Item";
import SizeCategory from "./types/SizeCategory";

export default class Monster extends CombatantBase {
  constructor(
    g: Engine,
    name: string,
    cr: ChallengeRating,
    type: CreatureType,
    size: SizeCategory,
    img: Url,
    hpMax: HitPoints,
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

  give(item: Item, quantity: Quantity = 1, giveProficiency = false) {
    if (giveProficiency) this.addProficiency(item, "proficient");
    return this.addToInventory(item, quantity);
  }

  getInventoryItem(name: ItemName) {
    for (const [item] of this.inventory) {
      if (item.name === name) return item;
    }

    throw new Error(`${this.name} does not have ${name} in inventory`);
  }
}
