import ErrorCollector from "../collectors/ErrorCollector";
import Effect from "../Effect";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import AbstractAction from "./AbstractAction";
import iconUrl from "./icons/dash.svg";

export const DashEffect = new Effect("Dash", "turnEnd", (g) => {
  g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
    if (who.hasEffect(DashEffect)) multiplier.add("double", DashEffect);
  });
});

export default class DashAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Dash",
      "implemented",
      {},
      {
        iconUrl,
        time: "action",
        description: `When you take the Dash action, you gain extra movement for the current turn. The increase equals your speed, after applying any modifiers. With a speed of 30 feet, for example, you can move up to 60 feet on your turn if you dash.

        Any increase or decrease to your speed changes this additional movement by the same amount. If your speed of 30 feet is reduced to 15 feet, for instance, you can move up to 30 feet this turn if you dash.`,
      },
    );
  }

  check(config: never, ec: ErrorCollector): ErrorCollector {
    if (this.actor.speed <= 0) ec.add("Zero speed", this);
    return super.check(config, ec);
  }

  async apply(): Promise<void> {
    await super.apply({});
    await this.actor.addEffect(DashEffect, { duration: 1 });
  }
}
