import { isCastSpell } from "../../actions/CastSpell";
import ActiveEffectArea from "../../ActiveEffectArea";
import { HasPoint } from "../../configs";
import Engine from "../../Engine";
import SubscriptionBag from "../../SubscriptionBag";
import Combatant from "../../types/Combatant";
import { arSet, SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import { resolveArea } from "../../utils/areas";
import { minutes } from "../../utils/time";
import { getSquares } from "../../utils/units";
import { simpleSpell } from "../common";
import { affectsByPoint } from "../helpers";

const getSilenceArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  radius: 20,
  centre,
});

class SilenceController {
  bag: SubscriptionBag;

  constructor(
    public g: Engine,
    public centre: Point,
    public shape = getSilenceArea(centre),
    public area = new ActiveEffectArea(
      "Silence",
      shape,
      arSet("silenced"),
      "purple",
    ),
    public squares = resolveArea(shape),
  ) {
    this.bag = new SubscriptionBag(
      g.events.on(
        "GetDamageResponse",
        ({ detail: { damageType, who, response } }) => {
          if (damageType === "thunder" && this.entirelyContains(who))
            response.add("immune", Silence);
        },
      ),
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (this.entirelyContains(who)) conditions.add("Deafened", Silence);
      }),
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (isCastSpell(action) && action.spell.v)
          error.add("silenced", Silence);
      }),
    );

    g.addEffectArea(area);
  }

  entirelyContains(who: Combatant) {
    const squares = getSquares(who, who.position);

    for (const square of squares) {
      if (!this.squares.has(square)) return false;
    }

    return true;
  }

  onSpellEnd = async () => {
    this.g.removeEffectArea(this.area);
    this.bag.cleanup();
  };
}

const Silence = simpleSpell<HasPoint>({
  status: "implemented",
  name: "Silence",
  level: 2,
  ritual: true,
  school: "Illusion",
  concentration: true,
  v: true,
  s: true,
  lists: ["Bard", "Cleric", "Ranger"],
  isHarmful: true, // TODO is it?
  description: `For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.`,

  ...affectsByPoint(120, getSilenceArea),

  async apply({ g, caster }, { point }) {
    const controller = new SilenceController(g, point);
    await caster.concentrateOn({
      spell: Silence,
      duration: minutes(10),
      onSpellEnd: controller.onSpellEnd,
    });
  },
});
export default Silence;
