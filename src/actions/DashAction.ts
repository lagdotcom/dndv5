import ErrorCollector from "../collectors/ErrorCollector";
import Effect from "../Effect";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import AbstractAction from "./AbstractAction";

export const DashEffect = new Effect("Dash", "turnEnd", (g) => {
  g.events.on("getSpeed", ({ detail: { who, multiplier } }) => {
    if (who.hasEffect(DashEffect)) multiplier.add(2, DashEffect);
  });
});

export default class DashAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Dash", {}, "action");
  }

  check(config: never, ec = new ErrorCollector()): ErrorCollector {
    if (this.actor.speed <= 0) ec.add("Zero speed", this);
    return super.check(config, ec);
  }

  async apply(): Promise<void> {
    super.apply({});
    this.actor.addEffect(DashEffect, 1);
  }
}