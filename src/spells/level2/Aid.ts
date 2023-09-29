import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { scalingSpell } from "../common";

const Aid = scalingSpell<HasTargets>({
  name: "Aid",
  level: 2,
  school: "Abjuration",
  v: true,
  s: true,
  m: "a tiny strip of white cloth",
  lists: ["Artificer", "Cleric", "Paladin"],

  getConfig: (g) => ({ targets: new MultiTargetResolver(g, 1, 3, 30, true) }),
  getTargets: (g, caster, { targets }) => targets,

  async apply(g, caster, method, { slot, targets }) {
    /* TODO [GETMAXHP] Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration.

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd. */
  },
});
export default Aid;
