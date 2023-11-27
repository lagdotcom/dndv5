import Engine from "../Engine";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import WeaponAttack from "./WeaponAttack";

export class TwoWeaponAttack extends WeaponAttack {
  constructor(g: Engine, actor: Combatant, weapon: WeaponItem) {
    super(g, actor, weapon, undefined, ["two-weapon"]);

    this.isAttack = false;
    this.name = `Two-Weapon ${this.name}`;
  }
}
