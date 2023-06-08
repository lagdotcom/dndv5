import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { simpleSpell } from "../common";

const Silence = simpleSpell<HasPoint>({
  name: "Silence",
  level: 2,
  ritual: true,
  school: "Illusion",
  concentration: true,
  v: true,
  s: true,
  lists: ["Bard", "Cleric", "Ranger"],

  getConfig: (g) => ({ point: new PointResolver(g, 120) }),
  getAffectedArea: (g, caster, { point }) =>
    point && [{ type: "sphere", radius: 20, centre: point }],

  async apply(g, caster, method, { point }) {
    // TODO [DEAFENED] [CHECKACTION] For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.
  },
});
export default Silence;
