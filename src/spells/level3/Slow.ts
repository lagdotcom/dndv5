import { HasTargets } from "../../configs";
import { simpleSpell } from "../common";
import { requiresSave, targetsMany } from "../helpers";

const Slow = simpleSpell<HasTargets>({
  name: "Slow",
  level: 3,
  school: "Transmutation",
  concentration: true,
  v: true,
  s: true,
  m: "a drop of molasses",
  lists: ["Sorcerer", "Wizard"],
  isHarmful: true,
  description: `You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration.

  An affected target's speed is halved, it takes a −2 penalty to AC and Dexterity saving throws, and it can't use reactions. On its turn, it can use either an action or a bonus action, not both. Regardless of the creature's abilities or magic items, it can't make more than one melee or ranged attack during its turn.

  If the creature attempts to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn't take effect until the creature's next turn, and the creature must use its action on that turn to complete the spell. If it can't, the spell is wasted.

  A creature affected by this spell makes another Wisdom saving throw at the end of each of its turns. On a successful save, the effect ends for it.`,

  ...targetsMany(1, 6, 120, []),
  ...requiresSave("wis"),

  check(g, config, ec) {
    // TODO You alter time around up to six creatures of your choice in a 40-foot cube within range.

    return ec;
  },

  async apply() {
    // TODO [GETAC] [ACTIONEVENT]
  },
});
export default Slow;
