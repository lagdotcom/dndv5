import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { simpleSpell } from "../common";

const GustOfWind = simpleSpell<HasPoint>({
  name: "Gust of Wind",
  level: 2,
  school: "Evocation",
  concentration: true,
  v: true,
  s: true,
  m: "a legume seed",
  lists: ["Druid", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 60) }),
  getTargets: () => [],

  async apply(g, caster, method, { point }) {
    /* TODO [FORCEMOVE] [GETMOVECOST] [DISPERSAL] [FLAMMABLE] A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell's duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line.

    Any creature in the line must spend 2 feet of movement for every 1 foot it moves when moving closer to you.

    The gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.

    As a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you. */
  },
});
export default GustOfWind;
