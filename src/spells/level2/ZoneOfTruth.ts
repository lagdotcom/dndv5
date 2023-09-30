import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import { simpleSpell } from "../common";

const getArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  centre,
  radius: 15,
});

const ZoneOfTruth = simpleSpell<HasPoint>({
  name: "Zone of Truth",
  level: 2,
  school: "Enchantment",
  v: true,
  s: true,
  lists: ["Bard", "Cleric", "Paladin"],
  description: `You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius. You know whether each creature succeeds or fails on its saving throw.

  An affected creature is aware of the spell and can thus avoid answering questions to which it would normally respond with a lie. Such creatures can be evasive in its answers as long as it remains within the boundaries of the truth.`,

  getConfig: (g) => ({ point: new PointResolver(g, 60) }),
  getAffectedArea: (g, caster, { point }) => point && [getArea(point)],
  getTargets: () => [],

  async apply(g, caster, method, config) {
    /* TODO */
  },
});
export default ZoneOfTruth;
