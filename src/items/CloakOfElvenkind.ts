import iconUrl from "@img/eq/hood.svg";

import AbstractAction from "../actions/AbstractAction";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import { isEquipmentAttuned } from "../utils/items";
import { AbstractWondrous } from "./wondrous";

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
      { icon: cloak.icon, time: "action" },
    );
  }

  async apply() {
    await super.apply({});
    this.cloak.hoodUp = !this.cloak.hoodUp;
    // TODO [MESSAGES] announce it
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
