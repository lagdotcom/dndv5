import Engine from "../Engine";
import { Feet, Url } from "../flavours";
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
    iconUrl?: Url,
    public shortRange?: Feet,
    public longRange?: Feet,
    public weaponType = name,
  ) {
    super(g, "weapon", name, 1, iconUrl);
    this.properties = new Set(properties);
  }

  get reach(): Feet {
    return this.properties.has("reach") ? 5 : 0;
  }
}
