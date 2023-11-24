import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import { simpleSpell } from "../common";

const getDarknessArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  centre,
  radius: 15,
});

const Darkness = simpleSpell<HasPoint>({
  name: "Darkness",
  level: 2,
  school: "Evocation",
  concentration: true,
  v: true,
  m: "bat fur and a drop of pitch or piece of coal",
  lists: ["Sorcerer", "Warlock", "Wizard"],
  description: `Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it.

  If the point you choose is on an object you are holding or one that isn't being worn or carried, the darkness emanates from the object and moves with it. Completely covering the source of the darkness with an opaque object, such as a bowl or a helm, blocks the darkness.
  
  If any of this spell's area overlaps with an area of light created by a spell of 2nd level or lower, the spell that created the light is dispelled.`,

  getConfig: (g) => ({ point: new PointResolver(g, 60) }),

  getTargets: () => [],
  getAffectedArea: (g, caster, { point }) => point && [getDarknessArea(point)],
  getAffected: (g, caster, { point }) => g.getInside(getDarknessArea(point)),

  async apply() {
    // TODO
  },
});
export default Darkness;
