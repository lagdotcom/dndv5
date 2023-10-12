import hissIconUrl from "@img/act/hiss.svg";

import AbstractAction from "../actions/AbstractAction";
import { makeIcon } from "../colours";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import { MapSquareSize } from "../MapSquare";
import { BoundedMove } from "../movement";
import TargetResolver from "../resolvers/TargetResolver";
import { ShortRestResource } from "../resources";
import Combatant from "../types/Combatant";
import { svSet } from "../types/SaveTag";
import { getSaveDC } from "../utils/dnd";
import { round } from "../utils/numbers";
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
      {
        icon: makeIcon(hissIconUrl),
        time: "bonus action",
        resources: [[HissResource, 1]],
      },
    );
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    const { g, actor } = this;

    // TODO make this into an actual reaction?
    if (target.hasTime("reaction")) {
      const dc = getSaveDC(actor, "cha");
      const save = await g.savingThrow(dc, {
        who: target,
        attacker: actor,
        ability: "wis",
        tags: svSet("frightened", "forced movement"),
      });
      if (save.outcome === "fail") {
        target.useTime("reaction");
        await g.applyBoundedMove(
          target,
          new BoundedMove(this, round(target.speed / 2, MapSquareSize), {
            cannotApproach: [actor],
            mustUseAll: true,
            provokesOpportunityAttacks: false,
          }),
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
  },
);
