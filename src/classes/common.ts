import Engine from "../Engine";
import ConfiguredFeature from "../features/ConfiguredFeature";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import Feature from "../types/Feature";
import PCClassName from "../types/PCClassName";
import { ordinal } from "../utils/numbers";

type ASIConfig =
  | { type: "ability"; abilities: AbilityName[] }
  | { type: "feat"; feat: Feature };

function asiSetup(g: Engine, me: Combatant, config: ASIConfig) {
  if (config.type === "ability")
    for (const ability of config.abilities) me[ability].score++;
  else me.addFeature(config.feat);
}

export function makeASI(className: PCClassName, level: number) {
  return new ConfiguredFeature<ASIConfig>(
    `Ability Score Improvement (${className} ${level})`,
    `When you reach ${ordinal(
      level
    )} level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.

If your DM allows the use of feats, you may instead take a feat.`,
    asiSetup
  );
}
