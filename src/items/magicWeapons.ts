import Engine from "../Engine";
import { Spear } from "./weapons";

export class SpearOfTheDarkSun extends Spear {
  constructor(g: Engine) {
    super(g, 1);
    this.name = "Spear of the Dark Sun";

    g.events.on("gatherDamage", ({ detail: { attacker, weapon, map } }) => {
      if (weapon === this && attacker.attunements.has(weapon)) {
        const amount = g.dice.roll(
          { attacker, weapon, type: "damage", size: 10 },
          "normal"
        );
        const type = "radiant"; // TODO daylight check
        map.add(type, amount.value);
      }
    });
  }
}
