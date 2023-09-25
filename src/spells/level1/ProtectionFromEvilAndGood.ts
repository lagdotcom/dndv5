import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import Combatant from "../../types/Combatant";
import { ctSet } from "../../types/CreatureType";
import { EffectConfig } from "../../types/EffectType";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const affectedTypes = ctSet(
  "aberration",
  "celestial",
  "elemental",
  "fey",
  "fiend",
  "undead",
);
const isAffected = (attacker?: Combatant) =>
  attacker && affectedTypes.has(attacker.type);

const isValidEffect = (effect?: Effect, config?: EffectConfig) =>
  effect?.tags.has("possession") ||
  config?.conditions?.has("Charmed") ||
  config?.conditions?.has("Frightened");

const ProtectionEffect = new Effect(
  "Protection from Evil and Good",
  "turnStart",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      if (who.hasEffect(ProtectionEffect) && isAffected(target))
        diceType.add("disadvantage", ProtectionEffect);
    });

    g.events.on(
      "BeforeEffect",
      ({ detail: { who, attacker, effect, config, success } }) => {
        if (
          who.hasEffect(ProtectionEffect) &&
          isAffected(attacker) &&
          isValidEffect(effect, config)
        )
          success.add("fail", ProtectionEffect);
      },
    );

    g.events.on(
      "BeforeSave",
      ({ detail: { who, attacker, effect, config, diceType } }) => {
        if (
          who.hasEffect(ProtectionEffect) &&
          isAffected(attacker) &&
          isValidEffect(effect, config)
        )
          diceType.add("advantage", ProtectionEffect);
      },
    );
  },
);

const ProtectionFromEvilAndGood = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Protection from Evil and Good",
  level: 1,
  school: "Abjuration",
  concentration: true,
  v: true,
  s: true,
  m: "holy water or powdered silver and iron, which the spell consumes",
  lists: ["Cleric", "Paladin", "Warlock", "Wizard"],

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, true),
  }),
  getTargets: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    const duration = minutes(10);
    await target.addEffect(ProtectionEffect, { duration }, caster);

    await caster.concentrateOn({
      spell: ProtectionFromEvilAndGood,
      duration,
      async onSpellEnd() {
        await target.removeEffect(ProtectionEffect);
      },
    });
  },
});
export default ProtectionFromEvilAndGood;
