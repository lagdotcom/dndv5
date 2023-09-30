import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import Combatant from "../../types/Combatant";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const SanctuaryEffect = new Effect<{
  caster: Combatant;
  method: SpellcastingMethod;
}>("Sanctuary", "turnStart", (g) => {
  /* TODO [CANCELATTACK] Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball.

If the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends. */
});

const Sanctuary = simpleSpell<HasTarget>({
  name: "Sanctuary",
  level: 1,
  school: "Abjuration",
  time: "bonus action",
  v: true,
  s: true,
  m: "a small silver mirror",
  lists: ["Artificer", "Cleric"],
  description: `You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball.

  If the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends.`,

  getConfig: (g) => ({ target: new TargetResolver(g, 30, true) }),
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    await target.addEffect(
      SanctuaryEffect,
      { caster, method, duration: minutes(1) },
      caster
    );
  },
});
export default Sanctuary;
