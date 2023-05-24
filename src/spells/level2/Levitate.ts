import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import TargetResolver from "../../resolvers/TargetResolver";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import SimpleSpell from "../SimpleSpell";

export default class Levitate extends SimpleSpell<HasTarget> {
  constructor(public g: Engine) {
    super("Levitate", 2, "Transmutation", "action", true, {
      target: new TargetResolver(g, 60, true),
    });
    this.setVSM(
      true,
      true,
      "either a small leather loop or a piece of golden wire bent into a cup shape with a long shank on one end"
    );
  }

  async apply(
    caster: Combatant,
    method: SpellcastingMethod,
    { target }: HasTarget
  ): Promise<void> {
    /* TODO One creature or loose object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.

    The target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target's altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can use your action to move the target, which must remain within the spell's range.

    When the spell ends, the target floats gently to the ground if it is still aloft. */
  }
}
