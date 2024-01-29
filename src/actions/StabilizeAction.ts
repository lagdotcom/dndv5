import { HasTarget } from "../configs";
import { Dying, Stable } from "../effects";
import Engine from "../Engine";
import { hasEffect } from "../filters";
import TargetResolver from "../resolvers/TargetResolver";
import { chSet } from "../types/CheckTag";
import Combatant from "../types/Combatant";
import { AbstractSingleTargetAction } from "./AbstractAction";

export default class StabilizeAction extends AbstractSingleTargetAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Stabilize",
      "implemented",
      { target: new TargetResolver(g, actor.reach, [hasEffect(Dying)]) },
      {
        description: `You can use your action to administer first aid to an unconscious creature and attempt to stabilize it, which requires a successful DC 10 Wisdom (Medicine) check.`,
        time: "action",
      },
    );
  }

  async applyEffect({ target }: HasTarget) {
    const { outcome } = await this.g.abilityCheck(10, {
      ability: "wis",
      skill: "Medicine",
      who: this.actor,
      tags: chSet(),
    });
    if (outcome === "success") {
      await target.removeEffect(Dying);
      await target.addEffect(Stable, { duration: Infinity });
    }
  }
}
