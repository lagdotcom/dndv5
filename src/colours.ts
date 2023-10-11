import DamageType from "./types/DamageType";
import Icon from "./types/Icon";
import { ItemRarity } from "./types/Item";

export const ClassColours = {
  Barbarian: "#e7623e",
  Bard: "#ab6dac",
  Cleric: "#91a1b2",
  Druid: "#7a853b",
  Fighter: "#7f513e",
  Monk: "#51a5c5",
  Paladin: "#b59e54",
  Ranger: "#507f62",
  Rogue: "#555752",
  Sorcerer: "#992e2e",
  Warlock: "#7b469b",
  Wizard: "#2a50a1",
};

export const DamageColours: Record<DamageType, string> = {
  bludgeoning: "#8b0000",
  piercing: "#4169e1",
  slashing: "#ff8c00",
  acid: "#32cd32",
  cold: "#6699cc",
  fire: "#ce2029",
  force: "#800080",
  lightning: "#ffd700",
  necrotic: "#6a0dad",
  poison: "#00ff00",
  psychic: "#9966cc",
  radiant: "#daa520",
  thunder: "#1e90ff",
};

export const Heal = "#50c878";

export const ItemRarityColours: Record<ItemRarity, string> = {
  Common: "#242528",
  Uncommon: "#1FC219",
  Rare: "#4990E2",
  "Very Rare": "#9810E0",
  Legendary: "#FEA227",
  Artifact: "#BE8972",
};

export const makeIcon = (url: string, colour?: string): Icon => ({
  url,
  colour,
});

export const makeItemIcon = (url: string, rarity: ItemRarity) =>
  makeIcon(url, ItemRarityColours[rarity]);
