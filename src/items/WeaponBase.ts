import Engine from "../Engine";
import AbilityName from "../types/AbilityName";
import DamageAmount from "../types/DamageAmount";
import {
  AmmunitionTag,
  WeaponCategory,
  WeaponItem,
  WeaponProperty,
  WeaponRangeCategory,
} from "../types/Item";
import { SetInitialiser } from "../utils/set";
import ItemBase from "./ItemBase";

export default class WeaponBase
  extends ItemBase<"weapon">
  implements WeaponItem
{
  ammunitionTag?: AmmunitionTag;
  forceAbilityScore?: AbilityName;
  properties: Set<WeaponProperty>;

  constructor(
    public g: Engine,
    name: string,
    public category: WeaponCategory,
    public rangeCategory: WeaponRangeCategory,
    public damage: DamageAmount,
    properties?: SetInitialiser<WeaponProperty>,
    iconUrl?: string,
    public shortRange?: number,
    public longRange?: number,
    public weaponType = name,
  ) {
    super(g, "weapon", name, 1, iconUrl);
    this.properties = new Set(properties);
  }

  get reach() {
    return this.properties.has("reach") ? 5 : 0;
  }
}
