import { HasCaster, HasTarget } from "../../configs";
import Effect from "../../Effect";
import { poSet, poWithin } from "../../utils/ai";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import { singleTarget } from "../helpers";

const ChillTouchEffect = new Effect<HasCaster>(
  "Chill Touch",
  "turnStart",
  (g) => {
    // [I]t can't regain hit points until the start of your next turn. Until then, the hand clings to the target.
    g.events.on("GatherHeal", ({ detail: { target, multiplier } }) => {
      if (target.hasEffect(ChillTouchEffect))
        multiplier.add("zero", ChillTouchEffect);
    });

    // If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.
    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      const config = who.getEffectConfig(ChillTouchEffect);
      if (who.type === "undead" && config && target === config.caster)
        diceType.add("disadvantage", ChillTouchEffect);
    });
  },
  { tags: ["magic"] },
);

const ChillTouch = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Chill Touch",
  level: 0,
  school: "Necromancy",
  v: true,
  s: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],
  description: `You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target.

  If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.
  
  This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,

  ...singleTarget(120, []),

  isHarmful: true,
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 8, "necrotic")],
  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(120, target)),
    })),

  async apply(sh) {
    const { caster, method } = sh;
    const { attack, critical, hit, target } = await sh.attack({
      target: sh.config.target,
      type: "ranged",
    });
    if (hit) {
      const damageInitialiser = await sh.rollDamage({
        critical,
        target,
        tags: ["ranged"],
      });
      await sh.damage({
        attack,
        target,
        damageType: "necrotic",
        damageInitialiser,
      });
      await target.addEffect(
        ChillTouchEffect,
        { duration: 2, caster, method },
        caster,
      );
    }
  },
});
export default ChillTouch;
