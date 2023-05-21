import { HasPoint, Scales } from "../../configs";
import Engine from "../../Engine";
import PointResolver from "../../resolvers/PointResolver";
import SlotResolver from "../../resolvers/SlotResolver";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import AbstractSpell from "../AbstractSpell";

export default class FogCloud extends AbstractSpell<HasPoint & Scales> {
  constructor(public g: Engine) {
    super("Fog Cloud", 1, "Conjuration", "action", true, {
      point: new PointResolver(g, 120),
      slot: new SlotResolver(g, 1),
    });
    this.setVSM(true, true);
  }

  async apply(
    caster: Combatant,
    method: SpellcastingMethod,
    { point, slot }: HasPoint & Scales
  ): Promise<void> {
    /* TODO You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.

    At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st. */
  }
}
