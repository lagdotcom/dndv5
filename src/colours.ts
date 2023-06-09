import { ActionIcon } from "./types/Action";
import Item, { ItemRarity } from "./types/Item";

export const ItemRarityColours: Record<ItemRarity, string> = {
  Common: "#242528",
  Uncommon: "#1FC219",
  Rare: "#4990E2",
  "Very Rare": "#9810E0",
  Legendary: "#FEA227",
  Artifact: "#BE8972",
};

export function getItemIcon(item?: Item): ActionIcon | undefined {
  if (item?.iconUrl)
    return { url: item.iconUrl, colour: ItemRarityColours[item.rarity] };
}
