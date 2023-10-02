import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";
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
  ) {
    super(g, name, { type, size, img, side: 1, hpMax });
  }

  don(item: Item, giveProficiency = false): void {
    super.don(item);

    if (giveProficiency) {
      if (item.itemType === "weapon")
        this.weaponProficiencies.add(item.weaponType);
      else if (item.itemType === "armor")
        this.armorProficiencies.add(item.category);
    }
  }
}
