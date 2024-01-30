import StandUpAction from "../../actions/StandUpAction";
import InterruptionCollector from "../../collectors/InterruptionCollector";
import { HasCaster, HasTarget } from "../../configs";
import Effect from "../../Effect";
import { Prone } from "../../effects";
import { EngineSaveConfig } from "../../Engine";
import { canSee } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import MessageBuilder from "../../MessageBuilder";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import DiceType from "../../types/DiceType";
import { EffectConfig } from "../../types/EffectType";
import Priority from "../../types/Priority";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";
import { aiTargetsOne, requiresSave, targetsOne } from "../helpers";

const getHideousLaughterSave = (
  who: Combatant,
  config: EffectConfig<HasCaster>,
  diceType: DiceType = "normal",
): EngineSaveConfig<HasCaster> => ({
  source: HideousLaughter,
  type: config.method.getSaveType(config.caster, HideousLaughter),
  who,
  ability: "wis",
  attacker: config.caster,
  effect: LaughterEffect,
  config,
  diceType,
  spell: HideousLaughter,
  method: config.method,
});

const LaughterEffect = new Effect<HasCaster>(
  "Hideous Laughter",
  "turnStart",
  (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(LaughterEffect))
        conditions.add("Incapacitated", LaughterEffect);
    });

    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (
        action.actor.hasEffect(LaughterEffect) &&
        action instanceof StandUpAction
      )
        error.add("laughing too hard", LaughterEffect);
    });

    const resave = (
      i: InterruptionCollector,
      who: Combatant,
      config: EffectConfig<HasCaster>,
      diceType: DiceType = "normal",
    ) =>
      i.add(
        new EvaluateLater(who, LaughterEffect, Priority.Normal, async () => {
          const { outcome } = await g.save(
            getHideousLaughterSave(who, config, diceType),
          );

          if (outcome === "success")
            await config.caster.endConcentration(HideousLaughter);
        }),
      );

    g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      const config = who.getEffectConfig(LaughterEffect);
      if (config) resave(interrupt, who, config);
    });
    g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
      const config = who.getEffectConfig(LaughterEffect);
      if (config) resave(interrupt, who, config, "advantage");
    });
  },
  { tags: ["magic"] },
);

const HideousLaughter = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Hideous Laughter",
  level: 1,
  school: "Enchantment",
  concentration: true,
  v: true,
  s: true,
  m: "tiny tarts and a feather that is waved in the air",
  lists: ["Bard", "Wizard"],
  description: `A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn't affected.

At the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it's triggered by damage. On a success, the spell ends.`,
  isHarmful: true,

  ...targetsOne(30, [canSee]),
  ...requiresSave("wis"),
  generateAttackConfigs: aiTargetsOne(30),

  async apply({ g, caster, method }, { target }) {
    if (target.int.score <= 4) {
      g.text(
        new MessageBuilder().co(target).text(" is too dumb for the joke."),
      );
      return;
    }

    const effect = LaughterEffect;
    const config: EffectConfig<HasCaster> = {
      caster,
      method,
      conditions: coSet("Incapacitated"),
      duration: minutes(1),
    };
    const { outcome } = await g.save(getHideousLaughterSave(target, config));

    if (outcome === "fail") {
      const success = await target.addEffect(effect, config, caster);
      if (success) {
        await target.addEffect(Prone, { duration: Infinity }, caster);
        caster.concentrateOn({
          spell: HideousLaughter,
          duration: minutes(1),
          async onSpellEnd() {
            await target.removeEffect(effect);
          },
        });
      }
    }
  },
});
export default HideousLaughter;
