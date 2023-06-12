import { HasTarget } from "../../configs";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import { simpleSpell } from "../common";

type Config = HasTarget & { mode: "enlarge" | "reduce" };

const EnlargeReduce = simpleSpell<Config>({
  name: "Enlarge/Reduce",
  level: 2,
  school: "Transmutation",
  concentration: true,
  v: true,
  s: true,
  m: "a pinch of powdered iron",
  lists: ["Artificer", "Sorcerer", "Wizard"],

  getConfig: (g) => ({
    target: new TargetResolver(g, 30, true),
    mode: new ChoiceResolver(g, [
      { label: "enlarge", value: "enlarge" },
      { label: "reduce", value: "reduce" },
    ]),
  }),
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { mode, target }) {
    /* TODO [GETSIZE] You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect.

If the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once.

- Enlarge. The target's size doubles in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category—from Medium to Large, for example. If there isn't enough room for the target to double its size, the creature or object attains the maximum possible size in the space available. Until the spell ends, the target also has advantage on Strength checks and Strength saving throws. The target's weapons also grow to match its new size. While these weapons are enlarged, the target's attacks with them deal 1d4 extra damage.
- Reduce. The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category—from Medium to Small, for example. Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws. The target's weapons also shrink to match its new size. While these weapons are reduced, the target's attacks with them deal 1d4 less damage (this can't reduce the damage below 1). */
  },
});
export default EnlargeReduce;
