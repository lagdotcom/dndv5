import Engine from "../Engine";
import { ItemRarity } from "../types/Item";
import { AbstractWondrous } from "./wondrous";

const GiantTypes = [
  "Hill",
  "Stone",
  "Frost",
  "Fire",
  "Cloud",
  "Storm",
] as const;
type GiantType = (typeof GiantTypes)[number];
const GiantStats: Record<GiantType, { str: number; rarity: ItemRarity }> = {
  Hill: { str: 21, rarity: "Uncommon" },
  Stone: { str: 23, rarity: "Rare" },
  Frost: { str: 23, rarity: "Rare" },
  Fire: { str: 25, rarity: "Rare" },
  Cloud: { str: 27, rarity: "Very Rare" },
  Storm: { str: 29, rarity: "Legendary" },
};
export class PotionOfGiantStrength extends AbstractWondrous {
  constructor(
    g: Engine,
    public type: GiantType,
  ) {
    super(g, `Potion of ${type} Giant Strength`, 0);
    this.rarity = GiantStats[type].rarity;

    // TODO [GETSCORE] When you drink this potion, your Strength score changes to {number} for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.
  }
}
