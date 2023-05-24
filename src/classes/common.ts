import Engine from "../Engine";
import ConfiguredFeature from "../features/ConfiguredFeature";
import Ability from "../types/Ability";
import Combatant from "../types/Combatant";
import Feature from "../types/Feature";
import PCClassName from "../types/PCClassName";

type ASIConfig =
  | { type: "ability"; abilities: Ability[] }
  | { type: "feat"; feat: Feature };

function asiSetup(g: Engine, me: Combatant, config: ASIConfig) {
  if (config.type === "ability")
    for (const ability of config.abilities) me[`${ability}Score`]++;
  else me.addFeature(config.feat);
}

export function makeASI(className: PCClassName, level: number) {
  return new ConfiguredFeature<ASIConfig>(
    `Ability Score Improvement (${className} ${level})`,
    asiSetup
  );
}
