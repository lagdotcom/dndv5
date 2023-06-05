import Engine from "../Engine";
import EvaluateLater from "../interruptions/EvaluateLater";
import { Spear } from "./weapons";

export class SpearOfTheDarkSun extends Spear {
  constructor(g: Engine) {
    super(g, 1);
    this.name = "Spear of the Dark Sun";

    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, critical, weapon, map, interrupt } }) => {
        if (weapon === this && attacker.attunements.has(weapon))
          interrupt.add(
            new EvaluateLater(attacker, this, async () => {
              const damageType = "radiant"; // TODO daylight check
              map.add(
                damageType,
                await g.rollDamage(
                  1,
                  { size: 10, attacker, damageType },
                  critical
                )
              );
            })
          );
      }
    );
  }
}
