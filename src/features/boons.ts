import AbstractAction from "../actions/AbstractAction";
import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import { BoundedMove } from "../movement";
import TargetResolver from "../resolvers/TargetResolver";
import { ShortRestResource } from "../resources";
import Combatant from "../types/Combatant";
import { getSaveDC } from "../utils/dnd";
import SimpleFeature from "./SimpleFeature";

const HissResource = new ShortRestResource("Hiss (Boon of Vassetri)", 1);

class HissAction extends AbstractAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Hiss (Boon of Vassetri)",
      "implemented",
      { target: new TargetResolver(g, 5) },
      "bonus action"
    );
  }

  check(config: Partial<HasTarget>, ec: ErrorCollector) {
    if (!this.actor.hasResource(HissResource)) ec.add("out of hisses", this);

    return super.check(config, ec);
  }

  async apply({ target }: HasTarget) {
    super.apply({ target });

    const { g, actor } = this;
    actor.spendResource(HissResource);

    if (target.time.has("reaction")) {
      const dc = getSaveDC(actor, "cha");
      const save = await g.savingThrow(dc, {
        who: target,
        attacker: actor,
        ability: "wis",
        tags: new Set(["frightened", "forced movement"]),
      });
      if (save.result === "fail") {
        target.time.delete("reaction");
        await g.applyBoundedMove(
          target,
          new BoundedMove(this, target.speed / 2, {
            cannotApproach: [actor],
            mustUseAll: true,
            provokesOpportunityAttacks: false,
          })
        );
      }
    }
  }
}

export const BoonOfVassetri = new SimpleFeature(
  "Boon of Vassetri",
  `You dared ask Vassetri for a boon of power and a bite on the neck was your reward. It provides the following benefits:

  - You may cast the spell [speak with animals] at will, but it can only target snakes.
  - As a bonus action, you hiss threateningly at an enemy within 5 feet. If the enemy fails a Wisdom save, they must spend their reaction to move half of their speed away from you in any direction. The DC is 8 + your proficiency bonus + your Charisma modifier. You can only use this ability once per short or long rest, and only when you are able to speak.`,
  (g, me) => {
    console.warn(`[Feature Not Complete] Boon of Vassetri (on ${me.name})`);

    me.initResource(HissResource);
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new HissAction(g, me));
    });

    // TODO add Speak with Animals
  }
);
