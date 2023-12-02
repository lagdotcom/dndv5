import Engine from "../Engine";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import WeaponAttack from "./WeaponAttack";

export class TwoWeaponAttack extends WeaponAttack {
  constructor(g: Engine, actor: Combatant, weapon: WeaponItem) {
    super(g, actor, weapon, undefined, ["two-weapon"]);

    this.tags.delete("costs attack");
    this.name = `Two-Weapon ${this.name}`;
  }

  getTime(): ActionTime {
    return "bonus action";
  }
}
