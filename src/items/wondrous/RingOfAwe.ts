import AbstractAction from "../../actions/AbstractAction";
import Effect from "../../Effect";
import Engine, { EngineSaveConfig } from "../../Engine";
import { DifficultyClass } from "../../flavours";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { DawnResource } from "../../resources";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import { EffectConfig } from "../../types/EffectType";
import Priority from "../../types/Priority";
import { isEquipmentAttuned } from "../../utils/items";
import { minutes } from "../../utils/time";
import WondrousItemBase from "../WondrousItemBase";

const RingOfAweResource = new DawnResource("Ring of Awe", 1);

interface Config {
  actor: Combatant;
  dc: DifficultyClass;
}

const getRingOfAweSave = (
  who: Combatant,
  attacker: Combatant,
  dc: DifficultyClass,
  config: EffectConfig<Config>,
): EngineSaveConfig<Config> => ({
  source: RingOfAweEffect,
  type: { type: "flat", dc },
  attacker,
  who,
  ability: "wis",
  effect: RingOfAweEffect,
  config,
  tags: ["charm", "magic"],
});

const RingOfAweEffect = new Effect<Config>(
  "Ring of Awe",
  "turnStart",
  (g) => {
    g.events.on(
      "GetConditions",
      ({ detail: { who, conditions, frightenedBy } }) => {
        const config = who.getEffectConfig(RingOfAweEffect);
        if (config) {
          conditions.add("Frightened", RingOfAweEffect);
          frightenedBy.add(config.actor);
        }
      },
    );

    g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      const config = who.getEffectConfig(RingOfAweEffect);
      if (config)
        interrupt.add(
          new EvaluateLater(who, RingOfAweEffect, Priority.Normal, async () => {
            const { outcome } = await g.save(
              getRingOfAweSave(who, config.actor, config.dc, config),
            );

            if (outcome === "success") await who.removeEffect(RingOfAweEffect);
          }),
        );
    });
  },
  { tags: ["magic"] },
);

class RingOfAweAction extends AbstractAction {
  constructor(
    g: Engine,
    actor: Combatant,
    item: RingOfAwe,
    private dc: DifficultyClass = 13,
  ) {
    super(
      g,
      actor,
      item.name,
      "implemented",
      {},
      {
        area: [{ type: "within", radius: 15, who: actor }],
        tags: ["harmful"],
        time: "action",
        resources: new Map([[RingOfAweResource, 1]]),
        description: `By holding the ring aloft and speaking a command word, you project a field of awe around you. Each creature of your choice in a 15-foot sphere centred on you must succeed on a DC ${dc} Wisdom save or become frightened for 1 minute. On each affected creature's turn, it may repeat the Wisdom saving throw. On a successful save, the effect ends for that creature.`,
      },
    );
  }

  getAffected() {
    return this.g
      .getInside({ type: "within", radius: 15, who: this.actor })
      .filter((co) => co.side !== this.actor.side);
  }
  getTargets() {
    return [];
  }

  async apply() {
    await super.apply({});

    const { g, actor, dc } = this;
    for (const who of this.getAffected()) {
      const effect = RingOfAweEffect;
      const config: EffectConfig<Config> = {
        conditions: coSet("Frightened"),
        duration: minutes(1),
        actor,
        dc,
      };

      const { outcome } = await g.save(
        getRingOfAweSave(who, actor, dc, config),
      );

      if (outcome === "fail") await who.addEffect(effect, config, actor);
    }
  }
}

export default class RingOfAwe extends WondrousItemBase {
  constructor(g: Engine) {
    super(g, "Ring of Awe", 0);
    this.attunement = true;
    this.rarity = "Rare";

    // While wearing this ring, your Charisma score increases by 1, to a maximum of 20.
    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (isEquipmentAttuned(this, who)) {
        who.cha.score++;
        who.initResource(RingOfAweResource);
      }
    });

    // By holding the ring aloft and speaking a command word, you project a field of awe around you. Each creature of your choice in a 15-foot sphere centred on you must succeed on a DC 13 Wisdom save or become frightened for 1 minute. On each affected creature's turn, it may repeat the Wisdom saving throw. On a successful save, the effect ends for that creature. This property cannot be used again until the next dawn.
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (isEquipmentAttuned(this, who))
        actions.push(new RingOfAweAction(g, who, this));
    });
  }
}
