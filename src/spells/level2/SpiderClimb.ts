import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { simpleSpell } from "../common";

const SpiderClimb = simpleSpell<HasTarget>({
  name: "Spider Climb",
  level: 2,
  school: "Transmutation",
  concentration: true,
  v: true,
  s: true,
  m: "a drop of bitumen and a spider",
  lists: ["Artificer", "Sorcerer", "Warlock", "Wizard"],

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, true),
  }),
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    // TODO [TERRAIN] Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.
  },
});
export default SpiderClimb;
