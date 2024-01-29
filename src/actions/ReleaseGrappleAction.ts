import { HasTarget } from "../configs";
import { Grappled } from "../effects";
import Engine from "../Engine";
import { ErrorFilter } from "../filters";
import TargetResolver from "../resolvers/TargetResolver";
import Combatant from "../types/Combatant";
import { AbstractSingleTargetAction } from "./AbstractAction";

const isGrappling = (who: Combatant): ErrorFilter<Combatant> => ({
  name: "grappling",
  message: "not grappling",
  check: (g, action, value) => who.grappling.has(value),
});

export default class ReleaseGrappleAction extends AbstractSingleTargetAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Release Grapple",
      "implemented",
      { target: new TargetResolver(g, Infinity, [isGrappling(actor)]) },
      { description: `You can release the target whenever you like.` },
    );
  }

  async applyEffect({ target }: HasTarget) {
    await target.removeEffect(Grappled);
  }
}
