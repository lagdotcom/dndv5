import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { simpleSpell } from "../common";

const WaterBreathing = simpleSpell<HasTargets>({
  name: "Water Breathing",
  level: 3,
  ritual: true,
  school: "Transmutation",
  v: true,
  s: true,
  m: "a short reed or piece of straw",
  lists: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ targets: new MultiTargetResolver(g, 1, 10, 30) }),
  getTargets: (g, caster, { targets }) => targets,

  async apply(g, caster, method, config) {
    // TODO [TERRAIN] This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.
  },
});
export default WaterBreathing;
