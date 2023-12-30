import AbilityName from "./AbilityName";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";
import Enchantment from "./Enchantment";
import Source from "./Source";

export const ItemRarities = [
  "Common",
  "Uncommon",
  "Rare",
  "Very Rare",
  "Legendary",
  "Artifact",
] as const;
export type ItemRarity = (typeof ItemRarities)[number];

export interface BaseItem extends Source {
  owner?: Combatant;
  possessor?: Combatant;
  hands: number;
  rarity: ItemRarity;
  attunement?: boolean;
  cursed?: boolean;
  magical?: boolean;
}

export const WeaponCategories = [
  "natural",
  "simple",
  "martial",
  "improvised",
] as const;
export type WeaponCategory = (typeof WeaponCategories)[number];
export const wcSet = (...items: WeaponCategory[]) => new Set(items);

export const WeaponRangeCategories = ["melee", "ranged"] as const;
export type WeaponRangeCategory = (typeof WeaponRangeCategories)[number];

export const WeaponProperties = [
  "ammunition",
  "finesse",
  "heavy",
  "light",
  "loading",
  "reach",
  "thrown",
  "two-handed",
  "versatile",
] as const;
export type WeaponProperty = (typeof WeaponProperties)[number];

export const AmmunitionTags = ["blowgun", "bow", "crossbow", "sling"] as const;
export type AmmunitionTag = (typeof AmmunitionTags)[number];

export interface WeaponItem extends BaseItem {
  itemType: "weapon";
  weaponType: string;
  category: WeaponCategory;
  rangeCategory: WeaponRangeCategory;
  damage: DamageAmount;
  properties: Set<WeaponProperty>;
  shortRange?: number;
  longRange?: number;
  ammunitionTag?: AmmunitionTag;
  forceAbilityScore?: AbilityName;
  reach: number;

  addEnchantment(e: Enchantment<"weapon">): void;
}

export interface AmmoItem extends BaseItem {
  itemType: "ammo";
  ammunitionTag: AmmunitionTag;

  addEnchantment(e: Enchantment<"ammo">): void;
}

export const ArmorCategories = ["light", "medium", "heavy", "shield"] as const;
export type ArmorCategory = (typeof ArmorCategories)[number];
export const acSet = (...items: ArmorCategory[]) => new Set(items);

export interface ArmorItem extends BaseItem {
  itemType: "armor";
  ac: number;
  category: ArmorCategory;
  stealthDisadvantage: boolean;
  minimumStrength: number;
  metal: boolean;

  addEnchantment(e: Enchantment<"armor">): void;
}

export interface PotionItem extends BaseItem {
  itemType: "potion";
  description?: string;
}

export interface WondrousItem extends BaseItem {
  itemType: "wondrous";

  addEnchantment(e: Enchantment<"wondrous">): void;
}

type Item = WeaponItem | AmmoItem | ArmorItem | PotionItem | WondrousItem;
export default Item;

export type ItemType = Item["itemType"];

export interface ItemByTypeKey {
  armor: ArmorItem;
  ammo: AmmoItem;
  potion: PotionItem;
  weapon: WeaponItem;
  wondrous: WondrousItem;
}
