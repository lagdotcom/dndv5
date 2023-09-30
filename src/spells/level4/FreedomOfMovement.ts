import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { simpleSpell } from "../common";

const FreedomOfMovement = simpleSpell<HasTarget>({
  name: "Freedom of Movement",
  level: 4,
  school: "Abjuration",
  v: true,
  s: true,
  m: "a leather strap, bound around the arm or a similar appendage",
  lists: ["Artificer", "Bard", "Cleric", "Druid", "Ranger"],
  description: `You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained.

  The target can also spend 5 feet of movement to automatically escape from nonmagical restraints, such as manacles or a creature that has it grappled. Finally, being underwater imposes no penalties on the target's movement or attacks.`,

  getConfig: (g, caster) => ({ target: new TargetResolver(g, caster.reach) }),
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    // TODO [TERRAIN] [CANCELCOLLECTOR] [CANCELCONDITION]
  },
});
export default FreedomOfMovement;
