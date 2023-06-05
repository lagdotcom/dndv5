import Effect from "../Effect";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import AbstractAction from "./AbstractAction";

export const DisengageEffect = new Effect("Disengage", "turnEnd", () => {
  // TODO
});

export default class DisengageAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Disengage", {}, "action");
  }

  async apply(): Promise<void> {
    super.apply({});
    this.actor.addEffect(DisengageEffect, 1);
  }
}