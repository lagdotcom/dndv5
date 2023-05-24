import Engine from "../Engine";
import { WondrousItem } from "../types/Item";
import AbstractItem from "./AbstractItem";

export class AbstractWondrous
  extends AbstractItem<"wondrous">
  implements WondrousItem
{
  constructor(g: Engine, name: string, public hands = 0) {
    super(g, "wondrous", name);
  }
}

export class BracersOfTheArbalest extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Bracers of the Arbalest");

    // TODO While wearing these bracers, you have proficiency with all crossbows

    // ... you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.
    g.events.on("gatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
      if (
        attacker.equipment.has(this) &&
        attacker.attunements.has(this) &&
        weapon?.ammunitionTag === "crossbow"
      )
        bonus.add(2, this);
    });
  }
}
