import { HasTarget } from "../configs";
import Effect from "../Effect";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import AbstractAction from "./AbstractAction";
import OpportunityAttack from "./OpportunityAttack";

export const DisengageEffect = new Effect("Disengage", "turnEnd", (g) => {
  g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
    if (
      action instanceof OpportunityAttack &&
      (config as HasTarget).target.hasEffect(DisengageEffect)
    )
      error.add("target used Disengage", DisengageEffect);
  });
});

export default class DisengageAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Disengage",
      "missing",
      {},
      {
        time: "action",
        description: `If you take the Disengage action, your movement doesn't provoke opportunity attacks for the rest of the turn.`,
      },
    );
  }

  async apply(): Promise<void> {
    await super.apply({});
    await this.actor.addEffect(DisengageEffect, { duration: 1 });
  }
}
