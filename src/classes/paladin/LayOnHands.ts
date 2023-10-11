import AbstractAction from "../../actions/AbstractAction";
import { Heal, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import NumberRangeResolver from "../../resolvers/NumberRangeResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import { LongRestResource } from "../../resources";
import Combatant from "../../types/Combatant";
import Resource from "../../types/Resource";
import { PaladinIcon } from "./common";
import iconUrl from "./icons/lay-on-hands.svg";

const LayOnHandsIcon = makeIcon(iconUrl, Heal);

const LayOnHandsResource = new LongRestResource("Lay on Hands", 5);

type HasCost = { cost: number };

class LayOnHandsHealAction extends AbstractAction<HasCost & HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Lay on Hands (Heal)",
      "implemented",
      {
        cost: new NumberRangeResolver(g, "Spend", 1, Infinity),
        target: new TargetResolver(g, actor.reach, true),
      },
      { icon: LayOnHandsIcon, time: "action" },
    );

    this.subIcon = PaladinIcon;
  }

  getConfig() {
    const resourceMax = this.actor.getResource(LayOnHandsResource);

    return {
      cost: new NumberRangeResolver(this.g, "Spend", 1, resourceMax),
      target: new TargetResolver(this.g, this.actor.reach, true),
    };
  }

  getHeal({ cost }: Partial<HasCost & HasTarget>) {
    if (typeof cost === "number")
      return [{ type: "flat" as const, amount: cost }];
  }

  getResources({ cost }: Partial<HasCost & HasTarget>) {
    const resources = new Map<Resource, number>();
    if (typeof cost === "number") resources.set(LayOnHandsResource, cost);
    return resources;
  }

  async apply(config: HasCost & HasTarget) {
    await super.apply(config);
    await this.g.heal(this, config.cost, {
      action: this,
      target: config.target,
      actor: this.actor,
    });
  }
}

// TODO [EFFECTREMOVAL] [CONDITIONREMOVAL]
const LayOnHands = new SimpleFeature(
  "Lay on Hands",
  `Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5.

As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.

Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.

This feature has no effect on undead and constructs.`,
  (g, me) => {
    console.warn(`[Feature Not Complete] Lay on Hands (on ${me.name})`);

    const max = (me.classLevels.get("Paladin") ?? 1) * 5;
    me.initResource(LayOnHandsResource, max, max);

    g.events.on("GetActions", ({ detail: { actions, who } }) => {
      if (who === me) actions.push(new LayOnHandsHealAction(g, me));
    });
  },
);
export default LayOnHands;
