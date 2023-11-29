import allFeatures, { FeatureName } from "../data/allFeatures";
import { OneAttackPerTurnRule } from "../DndRules";
import Engine from "../Engine";
import ConfiguredFeature from "../features/ConfiguredFeature";
import SimpleFeature from "../features/SimpleFeature";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import PCClassName from "../types/PCClassName";
import { ordinal } from "../utils/numbers";

type ASIConfig =
  | { type: "ability"; abilities: AbilityName[] }
  | { type: "feat"; feat: FeatureName };

function asiSetup(g: Engine, me: Combatant, config: ASIConfig) {
  if (config.type === "ability")
    for (const ability of config.abilities) me[ability].score++;
  else me.addFeature(allFeatures[config.feat]);
}

export function makeASI(className: PCClassName, level: number) {
  return new ConfiguredFeature<ASIConfig>(
    `Ability Score Improvement (${className} ${level})`,
    `When you reach ${ordinal(
      level,
    )} level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.

If your DM allows the use of feats, you may instead take a feat.`,
    asiSetup,
  );
}

export function makeExtraAttack(name: string, text: string, extra = 1) {
  return new SimpleFeature(name, text, (g, me) => {
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (
        action.isAttack &&
        action.actor === me &&
        action.actor.attacksSoFar.length <= extra
      )
        error.ignore(OneAttackPerTurnRule);
    });
  });
}
