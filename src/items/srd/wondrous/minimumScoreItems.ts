import Engine from "../../../Engine";
import { Score } from "../../../flavours";
import AbilityName from "../../../types/AbilityName";
import { ItemRarity } from "../../../types/Item";
import { isEquipmentAttuned } from "../../../utils/items";
import WondrousItemBase from "../../WondrousItemBase";
import { GiantStats, GiantType } from "../common";

class BaseStatItem extends WondrousItemBase {
  constructor(
    g: Engine,
    name: string,
    ability: AbilityName,
    score: Score,
    rarity: ItemRarity = "Rare",
  ) {
    super(g, name);
    this.attunement = true;
    this.rarity = rarity;

    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (isEquipmentAttuned(this, who)) who[ability].minimum = score;
    });
  }
}

export class AmuletOfHealth extends BaseStatItem {
  constructor(g: Engine) {
    super(g, "Amulet of Health", "con", 19);
  }
}

export class BeltOfGiantStrength extends BaseStatItem {
  constructor(
    g: Engine,
    public type: GiantType,
  ) {
    super(
      g,
      `Belt of ${type} Giant Strength`,
      "str",
      GiantStats[type].str,
      GiantStats[type].beltRarity,
    );
  }
}

export class GauntletsOfOgrePower extends BaseStatItem {
  constructor(g: Engine) {
    super(g, "Gauntlets of Ogre Power", "str", 19);
  }
}

export class HeadbandOfIntellect extends BaseStatItem {
  constructor(g: Engine) {
    super(g, "Headband of Intellect", "int", 19);
  }
}
