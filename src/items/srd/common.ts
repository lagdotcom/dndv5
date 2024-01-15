import { Score } from "../../flavours";
import { ItemRarity } from "../../types/Item";

const GiantTypes = [
  "Hill",
  "Stone",
  "Frost",
  "Fire",
  "Cloud",
  "Storm",
] as const;
export type GiantType = (typeof GiantTypes)[number];
export const GiantStats: Record<
  GiantType,
  { str: Score; potionRarity: ItemRarity; beltRarity: ItemRarity }
> = {
  Hill: { str: 21, potionRarity: "Uncommon", beltRarity: "Rare" },
  Stone: { str: 23, potionRarity: "Rare", beltRarity: "Very Rare" },
  Frost: { str: 23, potionRarity: "Rare", beltRarity: "Very Rare" },
  Fire: { str: 25, potionRarity: "Rare", beltRarity: "Very Rare" },
  Cloud: { str: 27, potionRarity: "Very Rare", beltRarity: "Legendary" },
  Storm: { str: 29, potionRarity: "Legendary", beltRarity: "Legendary" },
};
