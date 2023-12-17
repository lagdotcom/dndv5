import iconUrl from "@img/eq/hood.svg";

import AbstractAction from "../../../actions/AbstractAction";
import Engine from "../../../Engine";
import MessageBuilder from "../../../MessageBuilder";
import Combatant from "../../../types/Combatant";
import { isEquipmentAttuned } from "../../../utils/items";
import AbstractWondrous from "../../AbstractWondrous";

class CloakHoodAction extends AbstractAction {
  constructor(
    g: Engine,
    actor: Combatant,
    public cloak: CloakOfElvenkind,
  ) {
    super(
      g,
      actor,
      cloak.hoodUp ? "Pull Hood Down" : "Pull Hood Up",
      "incomplete",
      {},
      {
        icon: cloak.icon,
        time: "action",
        description: `While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak's color shifts to camouflage you.`,
      },
    );
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  async apply() {
    await super.apply({});
    this.cloak.hoodUp = !this.cloak.hoodUp;

    this.g.text(
      new MessageBuilder()
        .co(this.actor)
        .text(
          this.cloak.hoodUp
            ? " pulls the hood of their cloak up."
            : " pulls the hood of their cloak down.",
        ),
    );
  }
}

export default class CloakOfElvenkind extends AbstractWondrous {
  constructor(
    g: Engine,
    public hoodUp = true,
  ) {
    super(g, "Cloak of Elvenkind", 0, iconUrl);
    this.attunement = true;
    this.rarity = "Uncommon";

    const cloaked = (who?: Combatant) =>
      isEquipmentAttuned(this, who) && this.hoodUp;

    g.events.on(
      "BeforeCheck",
      ({ detail: { who, target, skill, diceType } }) => {
        if (skill === "Perception" && cloaked(target))
          diceType.add("disadvantage", this);

        if (skill === "Stealth" && cloaked(who))
          diceType.add("advantage", this);
      },
    );

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (isEquipmentAttuned(this, who))
        actions.push(new CloakHoodAction(g, who, this));
    });
  }
}
