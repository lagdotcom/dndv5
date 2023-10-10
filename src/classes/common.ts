import { OneAttackPerTurnRule } from "../DndRules";
import Engine from "../Engine";
import ConfiguredFeature from "../features/ConfiguredFeature";
import SimpleFeature from "../features/SimpleFeature";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import Feature from "../types/Feature";
import PCClassName from "../types/PCClassName";
import { ordinal } from "../utils/numbers";

export const ClassColours = {
  Barbarian: "#e7623e",
  Bard: "#ab6dac",
  Cleric: "#91a1b2",
  Druid: "#7a853b",
  Fighter: "#7f513e",
  Monk: "#51a5c5",
  Paladin: "#b59e54",
  Ranger: "#507f62",
  Rogue: "#555752",
  Sorcerer: "#992e2e",
  Warlock: "#7b469b",
  Wizard: "#2a50a1",
};

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
