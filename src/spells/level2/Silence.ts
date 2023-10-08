import CastSpell from "../../actions/CastSpell";
import ActiveEffectArea from "../../ActiveEffectArea";
import { HasPoint } from "../../configs";
import Engine from "../../Engine";
import { Unsubscribe } from "../../events/Dispatcher";
import PointResolver from "../../resolvers/PointResolver";
import Combatant from "../../types/Combatant";
import { arSet, SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import { resolveArea } from "../../utils/areas";
import { minutes } from "../../utils/time";
import { getSquares } from "../../utils/units";
import { simpleSpell } from "../common";

const getSilenceArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  radius: 20,
  centre,
});

class SilenceController {
  subscriptions: Unsubscribe[];

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
    this.subscriptions = [
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
        if (action instanceof CastSpell && action.spell.v)
          error.add("silenced", Silence);
      }),
    ];

    g.addEffectArea(area);
  }

  entirelyContains(who: Combatant) {
    const position = this.g.getState(who).position;
    const squares = getSquares(who, position);

    for (const square of squares) {
      if (!this.squares.has(square)) return false;
    }

    return true;
  }

  onSpellEnd = async () => {
    this.g.removeEffectArea(this.area);
    for (const cleanup of this.subscriptions) cleanup();
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
  description: `For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.`,

  getConfig: (g) => ({ point: new PointResolver(g, 120) }),
  getAffectedArea: (g, caster, { point }) => point && [getSilenceArea(point)],
  getTargets: () => [],

  async apply(g, caster, method, { point }) {
    const controller = new SilenceController(g, point);
    await caster.concentrateOn({
      spell: Silence,
      duration: minutes(10),
      onSpellEnd: controller.onSpellEnd,
    });
  },
});
export default Silence;
