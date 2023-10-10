import AbstractAction from "../actions/AbstractAction";
import { ItemRarityColours } from "../colours";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import iconUrl from "./icons/hood.svg";
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
      {
        iconUrl: cloak.iconUrl,
        iconColour: ItemRarityColours[cloak.rarity],
        time: "action",
      },
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
    super(g, "Cloak of Elvenkind");
    this.attunement = true;
    this.rarity = "Uncommon";
    this.iconUrl = iconUrl;

    const cloaked = (who?: Combatant) =>
      who &&
      who.equipment.has(this) &&
      who.attunements.has(this) &&
      this.hoodUp;

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
      if (who.equipment.has(this) && who.attunements.has(this))
        actions.push(new CloakHoodAction(g, who, this));
    });
  }
}
