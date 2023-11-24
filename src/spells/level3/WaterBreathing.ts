import { HasTargets } from "../../configs";
import { canSee } from "../../filters";
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
  description: `This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.`,

  getConfig: (g) => ({
    targets: new MultiTargetResolver(g, 1, 10, 30, [canSee]),
  }),
  getTargets: (g, caster, { targets }) => targets ?? [],
  getAffected: (g, caster, { targets }) => targets,

  async apply() {
    // TODO [TERRAIN]
  },
});
export default WaterBreathing;
