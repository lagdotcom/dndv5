import { HasCaster, HasPoint } from "../../configs";
import Effect from "../../Effect";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";
import { affectsByPoint, requiresSave } from "../helpers";

const FaerieFireEffect = new Effect<HasCaster>(
  "Faerie Fire",
  "turnEnd",
  (g) => {
    // TODO [LIGHT] For the duration, objects and affected creatures shed dim light in a 10-foot radius.

    // Any attack roll against an affected creature or object has advantage if the attacker can see it
    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      if (target.hasEffect(FaerieFireEffect) && g.canSee(who, target))
        diceType.add("advantage", FaerieFireEffect);
    });

    // [...]and the affected creature or object can't benefit from being invisible
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

  ...affectsByPoint(60, (centre) => ({ type: "cube", centre, length: 20 })),
  ...requiresSave("dex"),

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
