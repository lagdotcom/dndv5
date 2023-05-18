import Ability from "./Ability";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";

export interface BaseItem {
  name: string;
  hands: number;
  donned?: (who: Combatant) => void;
  doffed?: (who: Combatant) => void;
}

export const WeaponCategories = ["natural", "simple", "martial"] as const;
export type WeaponCategory = (typeof WeaponCategories)[number];

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
  name: string;
  weaponType: string;
  category: WeaponCategory;
  rangeCategory: WeaponRangeCategory;
  damage: DamageAmount;
  properties: Set<WeaponProperty>;
  shortRange?: number;
  longRange?: number;
  ammunitionTag?: AmmunitionTag;
  forceAbilityScore?: Ability;
}

export const ArmorCategories = ["light", "medium", "heavy", "shield"] as const;
export type ArmorCategory = (typeof ArmorCategories)[number];

export interface ArmorItem extends BaseItem {
  itemType: "armor";
  name: string;
  ac: number;
  category: ArmorCategory;
  stealthDisadvantage: boolean;
  minimumStrength: number;
}

type Item = WeaponItem | ArmorItem;
export default Item;
