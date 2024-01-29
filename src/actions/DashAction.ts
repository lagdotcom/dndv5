import iconUrl from "@img/act/dash.svg";

import ErrorCollector from "../collectors/ErrorCollector";
import { makeIcon } from "../colours";
import Effect from "../Effect";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import { AbstractSelfAction } from "./AbstractAction";

const DashIcon = makeIcon(iconUrl);

export const DashEffect = new Effect(
  "Dash",
  "turnEnd",
  (g) => {
    g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      if (who.hasEffect(DashEffect)) multiplier.add("double", DashEffect);
    });
  },
  { icon: DashIcon },
);

export default class DashAction extends AbstractSelfAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Dash",
      "implemented",
      {},
      {
        icon: DashIcon,
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

  async applyEffect() {
    await this.actor.addEffect(DashEffect, { duration: 1 });
  }
}
