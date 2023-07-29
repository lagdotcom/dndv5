import Engine from "../Engine";
import { Shield } from "./armor";

export class ArrowCatchingShield extends Shield {
  constructor(g: Engine) {
    super(g);
    this.name = "Arrow-Catching Shield";
    this.attunement = true;
    this.rarity = "Rare";

    g.events.on("GetAC", ({ detail: { who, pre, bonus } }) => {
      if (who.equipment.has(this) && pre?.tags.has("ranged"))
        bonus.add(2, this);
    });

    // TODO In addition, whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead.
  }
}
