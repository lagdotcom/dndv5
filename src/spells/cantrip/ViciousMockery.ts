import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { canSee } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import TargetResolver from "../../resolvers/TargetResolver";
import Priority from "../../types/Priority";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";

const ViciousMockeryEffect = new Effect(
  "Vicious Mockery",
  "turnEnd",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, interrupt, diceType } }) => {
      if (who.hasEffect(ViciousMockeryEffect))
        interrupt.add(
          new EvaluateLater(
            who,
            ViciousMockeryEffect,
            Priority.ChangesOutcome,
            async () => {
              await who.removeEffect(ViciousMockeryEffect);
              diceType.add("disadvantage", ViciousMockeryEffect);
            },
          ),
        );
    });
  },
  { tags: ["magic"] },
);

const ViciousMockery = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Vicious Mockery",
  level: 0,
  school: "Enchantment",
  v: true,
  lists: ["Bard"],
  description: `You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.

This spell's damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).`,
  isHarmful: true,

  getConfig: (g) => ({ target: new TargetResolver(g, 60, [canSee]) }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 4, "psychic")],

  async apply(sh, { target }) {
    const config = { duration: 1 };
    const { outcome, damageResponse } = await sh.save({
      who: target,
      ability: "wis",
      effect: ViciousMockeryEffect,
      config,
      save: "zero",
    });
    const damageInitialiser = await sh.rollDamage({ target });
    await sh.damage({
      damageInitialiser,
      damageResponse,
      damageType: "psychic",
      target,
    });

    if (outcome === "fail")
      await target.addEffect(ViciousMockeryEffect, config, sh.caster);
  },
});
export default ViciousMockery;
