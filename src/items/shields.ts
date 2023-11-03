import acsUrl from "@img/eq/arrow-catching-shield.svg";

import AbstractAction from "../actions/AbstractAction";
import { ItemRarityColours, makeIcon } from "../colours";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import { BeforeAttackDetail } from "../events/BeforeAttackEvent";
import { notSelf } from "../filters";
import YesNoChoice from "../interruptions/YesNoChoice";
import TargetResolver from "../resolvers/TargetResolver";
import Combatant from "../types/Combatant";
import { checkConfig } from "../utils/config";
import { isEquipmentAttuned } from "../utils/items";
import { Shield } from "./armor";

const acsIcon = makeIcon(acsUrl, ItemRarityColours.Rare);

class ArrowCatchingShieldAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private attack?: BeforeAttackDetail,
  ) {
    super(
      g,
      actor,
      "Arrow-Catching Shield",
      "implemented",
      { target: new TargetResolver(g, 5, [notSelf]) }, // TODO isAlly?
      {
        time: "reaction",
        icon: acsIcon,
        description: `Whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead.`,
      },
    );
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });

    if (!this.attack) throw new Error(`No attack to modify.`);

    // TODO [MESSAGE]
    this.attack.target = this.actor;
  }
}

export class ArrowCatchingShield extends Shield {
  constructor(g: Engine) {
    super(g, acsUrl);
    this.name = "Arrow-Catching Shield";
    this.attunement = true;
    this.rarity = "Rare";

    // You gain a +2 bonus to AC against ranged attacks while you wield this shield. This bonus is in addition to the shield's normal bonus to AC.
    g.events.on("GetAC", ({ detail: { who, pre, bonus } }) => {
      if (isEquipmentAttuned(this, who) && pre?.tags.has("ranged"))
        bonus.add(2, this);
    });

    // In addition, whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead.
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (isEquipmentAttuned(this, who))
        actions.push(new ArrowCatchingShieldAction(g, who));
    });
    g.events.on("BeforeAttack", ({ detail }) => {
      if (
        this.possessor &&
        isEquipmentAttuned(this, this.possessor) &&
        detail.tags.has("ranged")
      ) {
        const config: HasTarget = { target: detail.target };
        const action = new ArrowCatchingShieldAction(g, this.possessor, detail);

        if (checkConfig(g, action, config))
          detail.interrupt.add(
            new YesNoChoice(
              this.possessor,
              this,
              this.name,
              `${detail.who.name} is attacking ${detail.target.name} at range. Use ${this.possessor.name}'s reaction to become the target of the attack instead?`,
              async () => {
                await g.act(action, config);
              },
            ),
          );
      }
    });
  }
}
