import iconUrl from "@img/spl/levitate.svg";

import { makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import { canSee } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { simpleSpell } from "../common";

const Levitate = simpleSpell<HasTarget>({
  name: "Levitate",
  level: 2,
  icon: makeIcon(iconUrl),
  school: "Transmutation",
  concentration: true,
  v: true,
  s: true,
  m: "either a small leather loop or a piece of golden wire bent into a cup shape with a long shank on one end",
  lists: ["Druid", "Sorcerer", "Wizard"],
  description: `One creature or loose object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.

  The target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target's altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can use your action to move the target, which must remain within the spell's range.

  When the spell ends, the target floats gently to the ground if it is still aloft.`,

  getConfig: (g) => ({ target: new TargetResolver(g, 60, [canSee]) }),
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    /* TODO [HEIGHT] [CANCELMOVE] */
  },
});
export default Levitate;
