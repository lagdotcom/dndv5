import hissIconUrl from "@img/act/hiss.svg";

import AbstractAction from "../actions/AbstractAction";
import { makeIcon } from "../colours";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import { isEnemy } from "../filters";
import { MapSquareSize } from "../MapSquare";
import { BoundedMove } from "../movement";
import TargetResolver from "../resolvers/TargetResolver";
import { ShortRestResource } from "../resources";
import Combatant from "../types/Combatant";
import { checkConfig } from "../utils/config";
import { getExecutionMode } from "../utils/env";
import { round } from "../utils/numbers";
import SimpleFeature from "./SimpleFeature";

const HissResource = new ShortRestResource("Hiss (Boon of Vassetri)", 1);

class HissFleeAction extends AbstractAction {
  constructor(
    g: Engine,
    actor: Combatant,
    private other: Combatant,
  ) {
    super(g, actor, "Flee from Hiss", "implemented", {}, { time: "reaction" });
  }

  async apply() {
    await super.apply({});
    await this.g.applyBoundedMove(
      this.actor,
      new BoundedMove(this, round(this.actor.speed / 2, MapSquareSize), {
        cannotApproach: [this.other],
        mustUseAll: true,
        provokesOpportunityAttacks: false,
      }),
    );
  }
}

class HissAction extends AbstractAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Hiss (Boon of Vassetri)",
      "implemented",
      { target: new TargetResolver(g, 5, [isEnemy]) },
      {
        icon: makeIcon(hissIconUrl),
        time: "bonus action",
        resources: [[HissResource, 1]],
        isHarmful: true,
      },
    );
  }

  getTargets({ target }: Partial<HasTarget>) {
    return target ? [target] : [];
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    const { g, actor } = this;

    const action = new HissFleeAction(g, target, actor);
    if (checkConfig(g, action, {})) {
      const { outcome } = await g.save({
        source: this,
        type: { type: "ability", ability: "cha" },
        attacker: actor,
        who: target,
        ability: "wis",
        tags: ["frightened", "forced movement"],
      });
      if (outcome === "fail") await g.act(action, {});
    }
  }
}

export const BoonOfVassetri = new SimpleFeature(
  "Boon of Vassetri",
  `You dared ask Vassetri for a boon of power and a bite on the neck was your reward. It provides the following benefits:

  - You may cast the spell [speak with animals] at will, but it can only target snakes.
  - As a bonus action, you hiss threateningly at an enemy within 5 feet. If the enemy fails a Wisdom save, they must spend their reaction to move half of their speed away from you in any direction. The DC is 8 + your proficiency bonus + your Charisma modifier. You can only use this ability once per short or long rest, and only when you are able to speak.`,
  (g, me) => {
    if (getExecutionMode() !== "test")
      console.warn(`[Feature Not Complete] Boon of Vassetri (on ${me.name})`);

    me.initResource(HissResource);
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new HissAction(g, me));
    });

    // TODO add Speak with Animals
  },
);
