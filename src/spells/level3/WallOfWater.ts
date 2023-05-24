import { HasPoint } from "../../configs";
import Engine from "../../Engine";
import PointResolver from "../../resolvers/PointResolver";
import TextChoiceResolver from "../../resolvers/TextChoiceResolver";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import SimpleSpell from "../SimpleSpell";

type Config = HasPoint & { shape: "line" | "ring" };

export default class WallOfWater extends SimpleSpell<Config> {
  constructor(public g: Engine) {
    super("Wall of Water", 3, "Evocation", "action", true, {
      point: new PointResolver(g, 60),
      shape: new TextChoiceResolver(g, ["line", "ring"]),
    });
  }

  async apply(
    caster: Combatant,
    method: SpellcastingMethod,
    { point, shape }: Config
  ): Promise<void> {
    /* TODO You create a wall of water on the ground at a point you can see within range. You can make the wall up to 30 feet long, 10 feet high, and 1 foot thick, or you can make a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall vanishes when the spell ends. The wall's space is difficult terrain.

    Any ranged weapon attack that enters the wall's space has disadvantage on the attack roll, and fire damage is halved if the fire effect passes through the wall to reach its target. Spells that deal cold damage that pass through the wall cause the area of the wall they pass through to freeze solid (at least a 5-foot-square section is frozen). Each 5-foot-square frozen section has AC 5 and 15 hit points. Reducing a frozen section to 0 hit points destroys it. When a section is destroyed, the wall's water doesn't fill it. */
  }
}