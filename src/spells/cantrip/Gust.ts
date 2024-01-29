import { HasTarget } from "../../configs";
import { sizeOrLess } from "../../filters";
import SizeCategory from "../../types/SizeCategory";
import { simpleSpell } from "../common";
import { singleTarget } from "../helpers";

// TODO only does push effect
const Gust = simpleSpell<HasTarget>({
  status: "incomplete",
  name: "Gust",
  level: 0,
  school: "Transmutation",
  v: true,
  s: true,
  lists: ["Druid", "Sorcerer", "Wizard"],
  description: `You seize the air and compel it to create one of the following effects at a point you can see within range:

  - One Medium or smaller creature that you choose must succeed on a Strength saving throw or be pushed up to 5 feet away from you.
  - You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. The object is pushed up to 10 feet away from you. It isn't pushed with enough force to cause damage.
  - You create a harmless sensory effect using air, such as causing leaves to rustle, wind to slam shutters closed, or your clothing to ripple in a breeze.`,

  ...singleTarget(30, [sizeOrLess(SizeCategory.Medium)]),

  async apply(sh, { target }) {
    const { outcome } = await sh.save({
      who: target,
      ability: "str",
      tags: ["forced movement"],
    });
    if (outcome === "fail") await sh.g.forcePush(target, sh.caster, 5, Gust);
  },
});
export default Gust;
