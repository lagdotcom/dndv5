import Engine from "../Engine";
import { AbstractWeapon } from "../items/weapons";
import AbilityName from "../types/AbilityName";
import DamageAmount from "../types/DamageAmount";

export default class NaturalWeapon extends AbstractWeapon {
  constructor(
    g: Engine,
    name: string,
    toHit: number | AbilityName,
    damage: DamageAmount,
  ) {
    super(g, name, "natural", "melee", damage);

    if (typeof toHit === "string") this.forceAbilityScore = toHit;
    else {
      // TODO
    }
  }
}
