import { UsedAttackAction } from "../effects";
import Engine from "../Engine";
import { ActionConfig } from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import Empty from "../types/Empty";
import ImplementationStatus from "../types/ImplementationStatus";
import AbstractAction, { AbstractActionOptions } from "./AbstractAction";

export default class AbstractAttackAction<
  T extends object = Empty,
> extends AbstractAction<T> {
  constructor(
    g: Engine,
    actor: Combatant,
    name: string,
    status: ImplementationStatus,
    config: ActionConfig<T>,
    options: AbstractActionOptions = {},
  ) {
    super(g, actor, name, status, config, options);
    this.isAttack = true;
    this.isHarmful = true;
  }

  generateHealingConfigs() {
    return [];
  }

  getTime(): ActionTime | undefined {
    // if we already used Attack, costs nothing
    if (this.actor.hasEffect(UsedAttackAction)) return undefined;

    return "action";
  }

  async apply(config: T) {
    await super.apply(config);

    // a subclass might override this (e.g. OpportunityAttack)
    if (this.isAttack) {
      this.actor.attacksSoFar.push(this);
      await this.actor.addEffect(UsedAttackAction, { duration: 1 });
    }
  }
}
