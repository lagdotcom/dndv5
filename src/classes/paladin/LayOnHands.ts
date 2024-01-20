import iconUrl from "@img/act/lay-on-hands.svg";

import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import { Heal, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { notOfCreatureType } from "../../filters";
import { makeChoice } from "../../interruptions/PickFromListChoice";
import MultiChoiceResolver from "../../resolvers/MultiChoiceResolver";
import NumberRangeResolver from "../../resolvers/NumberRangeResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import { LongRestResource } from "../../resources";
import Combatant from "../../types/Combatant";
import EffectType from "../../types/EffectType";
import Resource from "../../types/Resource";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { enumerate } from "../../utils/numbers";
import { hasAny } from "../../utils/set";
import { PaladinIcon } from "./common";

const LayOnHandsCureIcon = makeIcon(iconUrl);
const LayOnHandsHealIcon = makeIcon(iconUrl, Heal);
const LayOnHandsResource = new LongRestResource("Lay on Hands", 5);

const isHealable = notOfCreatureType("undead", "construct");

type HealConfig = HasTarget & { cost: number };

class LayOnHandsHealAction extends AbstractAction<HealConfig> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Lay on Hands (Heal)",
      "implemented",
      {
        cost: new NumberRangeResolver(g, "Spend", 1, Infinity),
        target: new TargetResolver(g, actor.reach, [isHealable]),
      },
      {
        icon: LayOnHandsHealIcon,
        subIcon: PaladinIcon,
        time: "action",
        description: `As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.`,
      },
    );
  }

  getAffected({ target }: HealConfig) {
    return [target];
  }
  getTargets({ target }: HealConfig) {
    return sieve(target);
  }

  generateHealingConfigs(targets: Combatant[]) {
    const resourceMax = this.actor.getResource(LayOnHandsResource);

    return targets.flatMap((target) =>
      enumerate(1, resourceMax).map((cost) => ({
        config: { cost, target },
        positioning: poSet(poWithin(this.actor.reach, target)),
      })),
    );
  }

  getConfig() {
    const resourceMax = this.actor.getResource(LayOnHandsResource);

    return {
      cost: new NumberRangeResolver(this.g, "Spend", 1, resourceMax),
      target: new TargetResolver(this.g, this.actor.reach, []),
    };
  }

  getHeal({ cost }: Partial<HealConfig>) {
    if (typeof cost === "number")
      return [{ type: "flat" as const, amount: cost }];
  }

  getResources({ cost }: Partial<HealConfig>) {
    const resources = new Map<Resource, number>();
    if (typeof cost === "number") resources.set(LayOnHandsResource, cost);
    return resources;
  }

  async apply(config: HealConfig) {
    await super.apply(config);
    await this.g.heal(this, config.cost, {
      action: this,
      target: config.target,
      actor: this.actor,
    });
  }
}

type CureConfig = HasTarget & { effects: EffectType<unknown>[] };

function isCurable(e: EffectType<unknown>) {
  return hasAny(e.tags, ["disease", "poison"]);
}

const getCurableEffects = (who: Combatant) =>
  Array.from(who.effects.keys())
    .filter(isCurable)
    .map((effect) => makeChoice(effect, effect.name));

class LayOnHandsCureAction extends AbstractAction<CureConfig> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Lay on Hands (Cure)",
      "implemented",
      {
        target: new TargetResolver(g, actor.reach, [isHealable]),
        effects: new MultiChoiceResolver(g, [], 1, Infinity),
      },
      {
        icon: LayOnHandsCureIcon,
        subIcon: PaladinIcon,
        time: "action",
        description: `As an action, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.`,
      },
    );
  }

  getAffected({ target }: CureConfig) {
    return [target];
  }
  getTargets({ target }: CureConfig) {
    return sieve(target);
  }

  getConfig({ target }: Partial<CureConfig>) {
    const valid = target ? getCurableEffects(target) : [];
    return {
      target: new TargetResolver(this.g, this.actor.reach, [isHealable]),
      effects: new MultiChoiceResolver(this.g, valid, 1, Infinity),
    };
  }

  check({ target, effects }: Partial<CureConfig>, ec: ErrorCollector) {
    if (target && effects) {
      const cost = effects.length * 5;
      if (!this.actor.hasResource(LayOnHandsResource, cost))
        ec.add("not enough healing left", this);

      for (const effect of effects) {
        if (!isCurable(effect)) ec.add(`not valid: ${effect.name}`, this);
        if (!target.hasEffect(effect))
          ec.add(`not present: ${effect.name}`, this);
      }
    }

    return super.check({ target }, ec);
  }

  async apply({ target, effects }: CureConfig) {
    await super.apply({ target, effects });

    const cost = effects.length * 5;
    this.actor.spendResource(LayOnHandsResource, cost);

    for (const effect of effects) await target.removeEffect(effect);
  }
}

const LayOnHands = new SimpleFeature(
  "Lay on Hands",
  `Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5.

As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.

Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.

This feature has no effect on undead and constructs.`,
  (g, me) => {
    const max = me.getClassLevel("Paladin", 1) * 5;
    me.initResource(LayOnHandsResource, max, max);

    g.events.on("GetActions", ({ detail: { actions, who } }) => {
      if (who === me)
        actions.push(
          new LayOnHandsHealAction(g, me),
          new LayOnHandsCureAction(g, me),
        );
    });
  },
);
export default LayOnHands;
