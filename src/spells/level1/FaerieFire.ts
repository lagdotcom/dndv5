import { HasCaster, HasPoint } from "../../configs";
import Effect from "../../Effect";
import PointResolver from "../../resolvers/PointResolver";
import { SpecifiedCube } from "../../types/EffectArea";
import Point from "../../types/Point";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const getFaerieFireArea = (centre: Point): SpecifiedCube => ({
  type: "cube",
  centre,
  length: 20,
});

const FaerieFireEffect = new Effect<HasCaster>(
  "Faerie Fire",
  "turnEnd",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
      if (target.hasEffect(FaerieFireEffect))
        diceType.add("advantage", FaerieFireEffect);
    });

    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      // close enough
      if (who.hasEffect(FaerieFireEffect)) conditions.ignoreValue("Invisible");
    });
  },
  { tags: ["magic"] },
);

const FaerieFire = simpleSpell<HasPoint>({
  status: "implemented",
  name: "Faerie Fire",
  level: 1,
  school: "Evocation",
  concentration: true,
  v: true,
  lists: ["Artificer", "Bard", "Druid"],
  description: `Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.

  Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible.`,
  isHarmful: true,

  getConfig: (g) => ({ point: new PointResolver(g, 60) }),
  getAffectedArea: (g, caster, { point }) =>
    point && [getFaerieFireArea(point)],
  getAffected: (g, caster, { point }) => g.getInside(getFaerieFireArea(point)),
  getTargets: () => [],

  async apply(sh) {
    const mse = sh.getMultiSave({
      ability: "wis",
      effect: FaerieFireEffect,
      duration: minutes(1),
    });
    if (await mse.apply({})) await mse.concentrate();
  },
});
export default FaerieFire;
