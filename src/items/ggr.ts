import { AbstractSingleTargetAction } from "../actions/AbstractAction";
import Engine from "../Engine";
import { GatherDamageDetail } from "../events/GatherDamageEvent";
import { canSee, notSelf } from "../filters";
import YesNoChoice from "../interruptions/YesNoChoice";
import TargetResolver from "../resolvers/TargetResolver";
import Combatant from "../types/Combatant";
import Priority from "../types/Priority";
import { checkConfig } from "../utils/config";
import { getTotalDamage } from "../utils/dnd";
import { isEquipmentAttuned } from "../utils/items";
import { clamp } from "../utils/numbers";
import { distance } from "../utils/units";
import { Shield } from "./armor";

class PariahsShieldAction extends AbstractSingleTargetAction {
  constructor(
    g: Engine,
    actor: Combatant,
    private gather?: GatherDamageDetail,
  ) {
    super(
      g,
      actor,
      "Pariah's Shield",
      "implemented",
      { target: new TargetResolver(g, 5, [canSee, notSelf]) },
      {
        description: `When a creature you can see within 5 feet of you takes damage, you can use your reaction to take that damage, instead of the creature taking it. When you do so, the damage type changes to force.`,
        time: "reaction",
      },
    );
  }

  async applyEffect() {
    const { g, actor, gather } = this;
    if (!gather) throw new Error(`PariahsShield.apply() without GatherDamage`);

    const total = getTotalDamage(gather);
    if (total > 0) {
      gather.multiplier.add("zero", this);
      await g.damage(this, "force", { target: actor }, [["force", total]]);
    }
  }
}

export class PariahsShield extends Shield {
  constructor(g: Engine) {
    super(g);
    this.attunement = true;
    this.rarity = "Rare";

    // You gain a +1 bonus to AC for every two allies within 5 feet of you (up to a maximum of +3) while you wield this shield. This bonus is in addition to the shield's normal bonus to AC.
    g.events.on("GetAC", ({ detail: { who, bonus } }) => {
      if (isEquipmentAttuned(this, who)) {
        const allies = Array.from(g.combatants).filter(
          (other) =>
            other.side === who.side &&
            other !== who &&
            distance(who, other) <= 5,
        ).length;
        const value = clamp(Math.floor(allies / 2), 0, 3);
        if (value) bonus.add(value, this);
      }
    });

    // When a creature you can see within 5 feet of you takes damage, you can use your reaction to take that damage, instead of the creature taking it. When you do so, the damage type changes to force.
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (isEquipmentAttuned(this, who))
        actions.push(new PariahsShieldAction(g, who));
    });
    g.events.on("GatherDamage", ({ detail }) => {
      for (const who of g.combatants) {
        if (isEquipmentAttuned(this, who)) {
          const action = new PariahsShieldAction(g, who, detail);
          const config = { target: detail.target };

          if (checkConfig(g, action, config))
            detail.interrupt.add(
              new YesNoChoice(
                who,
                this,
                "Pariah's Shield",
                "...",
                Priority.Late,
                () => g.act(action, config),
                undefined,
                () => getTotalDamage(detail) > 0,
              ).setDynamicText(
                () =>
                  `${detail.target.name} is about to take ${getTotalDamage(detail)} damage. Should ${action.actor.name} use their reaction to take it for them as force damage?`,
              ),
            );
        }
      }
    });
  }
}
