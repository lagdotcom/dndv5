import Engine from "../Engine";
import { isEquipmentAttuned } from "../utils/items";
import { clamp } from "../utils/numbers";
import { distance } from "../utils/units";
import { Shield } from "./armor";

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

    // TODO When a creature you can see within 5 feet of you takes damage, you can use your reaction to take that damage, instead of the creature taking it. When you do so, the damage type changes to force.
  }
}
