import ErrorCollector from "../../collectors/ErrorCollector";
import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { scalingSpell } from "../common";

const HoldPerson = scalingSpell<HasTargets>({
  name: "Hold Person",
  level: 2,
  school: "Enchantment",
  concentration: true,
  v: true,
  s: true,
  m: "a small, straight piece of iron",
  lists: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"],

  getConfig: (g, actor, method, { slot }) => ({
    targets: new MultiTargetResolver(g, 1, (slot ?? 2) - 1, 60),
  }),

  check(g, { targets }, ec = new ErrorCollector()) {
    // TODO When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd. The humanoids must be within 30 feet of each other when you target them.

    return ec;
  },

  async apply(g, caster, method, { targets }) {
    // TODO Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.
  },
});
export default HoldPerson;
