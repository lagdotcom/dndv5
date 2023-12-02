import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import WeaponAttack from "./WeaponAttack";

export default class OpportunityAttack extends WeaponAttack {
  constructor(g: Engine, actor: Combatant, weapon: WeaponItem) {
    super(g, actor, weapon);
    this.tags.delete("costs attack");
  }

  getTime(): ActionTime {
    return "reaction";
  }

  check(config: Partial<HasTarget>, ec: ErrorCollector) {
    if (this.weapon.rangeCategory !== "melee")
      ec.add("can only make opportunity attacks with melee weapons", this);

    return super.check(config, ec);
  }
}
