import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import WeaponAttack, { doStandardAttack } from "./WeaponAttack";

export default class OpportunityAttack extends WeaponAttack {
  constructor(g: Engine, actor: Combatant, weapon: WeaponItem) {
    super(g, actor, weapon);

    this.isAttack = false;
  }

  getTime(): ActionTime {
    return "reaction";
  }

  check(config: Partial<HasTarget>, ec: ErrorCollector) {
    super.check(config, ec);

    if (this.weapon.rangeCategory !== "melee")
      ec.add("can only make opportunity attacks with melee weapons", this);

    return ec;
  }

  async apply({ target }: HasTarget) {
    this.actor.time.delete("reaction");

    await doStandardAttack(this.g, {
      ability: this.ability,
      ammo: this.ammo,
      attacker: this.actor,
      source: this,
      target,
      weapon: this.weapon,
    });
  }
}
