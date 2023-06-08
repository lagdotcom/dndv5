import Engine from "../Engine";
import { Shield } from "./armor";

export class ArrowCatchingShield extends Shield {
  constructor(g: Engine) {
    super(g);
    this.name = "Arrow-Catching Shield";
    this.attunement = true;
    this.rarity = "Rare";

    // TODO [GETAC] You gain a +2 bonus to AC against ranged attacks while you wield this shield. This bonus is in addition to the shield's normal bonus to AC.

    // TODO In addition, whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead.
  }
}
