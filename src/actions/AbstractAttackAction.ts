import { UsedAttackAction } from "../effects";
import Engine from "../Engine";
import { ActionConfig } from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import Empty from "../types/Empty";
import ImplementationStatus from "../types/ImplementationStatus";
import { WeaponItem } from "../types/Item";
import RangeCategory from "../types/RangeCategory";
import AbstractAction, { AbstractActionOptions } from "./AbstractAction";

export default abstract class AbstractAttackAction<
  T extends object = Empty,
> extends AbstractAction<T> {
  weapon?: WeaponItem;

  constructor(
    g: Engine,
    actor: Combatant,
    name: string,
    status: ImplementationStatus,
    public weaponName: string,
    public rangeCategory: RangeCategory,
    config: ActionConfig<T>,
    options: AbstractActionOptions = {},
  ) {
    super(g, actor, name, status, config, options);
    this.tags.add("attack");
    this.tags.add("costs attack");
    this.tags.add("harmful");
  }

  generateHealingConfigs() {
    return [];
  }

  getTime(): ActionTime | undefined {
    // if we already used Attack, costs nothing
    if (this.tags.has("costs attack") && this.actor.hasEffect(UsedAttackAction))
      return undefined;

    return "action";
  }

  async applyCosts(config: T) {
    await super.applyCosts(config);

    // a subclass might override this (e.g. OpportunityAttack)
    if (this.tags.has("costs attack")) {
      this.actor.attacksSoFar.push(this);
      await this.actor.addEffect(UsedAttackAction, { duration: 1 });
    }
  }
}
