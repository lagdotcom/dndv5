import { ActionIcon } from "./types/Action";
import Item, { ItemRarity } from "./types/Item";

export const ItemRarityColours: Record<ItemRarity, string> = {
  Common: "",
  Uncommon:
    "invert(43%) sepia(73%) saturate(789%) hue-rotate(76deg) brightness(114%) contrast(97%)",
  Rare: "invert(54%) sepia(70%) saturate(1877%) hue-rotate(189deg) brightness(92%) contrast(92%)",
  "Very Rare":
    "invert(17%) sepia(86%) saturate(4261%) hue-rotate(276deg) brightness(87%) contrast(112%)",
  Legendary:
    "invert(70%) sepia(84%) saturate(1467%) hue-rotate(339deg) brightness(101%) contrast(99%)",
  Artifact:
    "invert(70%) sepia(84%) saturate(1467%) hue-rotate(339deg) brightness(101%) contrast(99%)",
};

export function getItemIcon(item?: Item): ActionIcon | undefined {
  if (item?.iconUrl)
    return { url: item.iconUrl, colour: ItemRarityColours[item.rarity] };
}
