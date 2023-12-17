import Engine from "../../../Engine";
import AbstractWondrous from "../../AbstractWondrous";
import { GiantStats, GiantType } from "../common";

export class PotionOfGiantStrength extends AbstractWondrous {
  constructor(
    g: Engine,
    public type: GiantType,
  ) {
    super(g, `Potion of ${type} Giant Strength`, 0);
    this.rarity = GiantStats[type].potionRarity;

    // TODO [GETSCORE] When you drink this potion, your Strength score changes to {number} for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.
  }
}
