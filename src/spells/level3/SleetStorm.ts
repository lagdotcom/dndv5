import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { simpleSpell } from "../common";

const SleetStorm = simpleSpell<HasPoint>({
  name: "Sleet Storm",
  level: 3,
  school: "Conjuration",
  concentration: true,
  v: true,
  s: true,
  m: "a pinch of dust and a few drops of water",
  lists: ["Druid", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 150) }),
  getAffectedArea: (g, caster, { point }) =>
    point && [{ type: "cylinder", centre: point, radius: 40, height: 20 }],
  getTargets: () => [],

  async apply(g, caster, method, { point }) {
    /* TODO [TERRAIN] Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused.

The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone.

If a creature starts its turn in the spell's area and is concentrating on a spell, the creature must make a successful Constitution saving throw against your spell save DC or lose concentration. */
  },
});
export default SleetStorm;
