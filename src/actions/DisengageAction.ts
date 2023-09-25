import Effect from "../Effect";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import AbstractAction from "./AbstractAction";

export const DisengageEffect = new Effect("Disengage", "turnEnd", () => {
  // TODO [OPPORTUNITY]
});

export default class DisengageAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Disengage", "missing", {}, { time: "action" });
  }

  async apply(): Promise<void> {
    super.apply({});
    await this.actor.addEffect(DisengageEffect, { duration: 1 });
  }
}
