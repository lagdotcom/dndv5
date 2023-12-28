import Engine from "../Engine";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import RangeCategory from "../types/RangeCategory";
import WeaponAttack from "./WeaponAttack";

export class TwoWeaponAttack extends WeaponAttack {
  constructor(
    g: Engine,
    actor: Combatant,
    rangeCategory: RangeCategory,
    weapon: WeaponItem,
  ) {
    super(g, "Two-Weapon Attack", actor, rangeCategory, weapon, undefined, [
      "two-weapon",
    ]);

    this.tags.delete("costs attack");
  }

  getTime(): ActionTime {
    return "bonus action";
  }
}
