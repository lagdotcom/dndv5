import ErrorCollector from "../collectors/ErrorCollector";
import Effect from "../Effect";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import AbstractAction from "./AbstractAction";

export const DashEffect = new Effect("Dash", "turnEnd", (g) => {
  g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
    if (who.hasEffect(DashEffect)) multiplier.add("double", DashEffect);
  });
});

export default class DashAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Dash", "implemented", {}, { time: "action" });
  }

  check(config: never, ec: ErrorCollector): ErrorCollector {
    if (this.actor.speed <= 0) ec.add("Zero speed", this);
    return super.check(config, ec);
  }

  async apply(): Promise<void> {
    super.apply({});
    this.actor.addEffect(DashEffect, { duration: 1 });
  }
}
