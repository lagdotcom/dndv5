import { HasPoint } from "../../configs";
import Engine from "../../Engine";
import PointResolver from "../../resolvers/PointResolver";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import SimpleSpell from "../SimpleSpell";

export default class GustOfWind extends SimpleSpell<HasPoint> {
  constructor(public g: Engine) {
    super("Gust of Wind", 2, "Evocation", "action", true, {
      point: new PointResolver(g, 60),
    });
    this.setVSM(true, true, "a legume seed");
  }

  async apply(
    caster: Combatant,
    method: SpellcastingMethod,
    { point }: HasPoint
  ): Promise<void> {
    /* TODO A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell's duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line.

    Any creature in the line must spend 2 feet of movement for every 1 foot it moves when moving closer to you.

    The gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.

    As a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you. */
  }
}
