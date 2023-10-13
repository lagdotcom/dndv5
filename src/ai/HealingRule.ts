import EvaluationCollector from "../collectors/EvaluationCollector";
import Engine from "../Engine";
import Action from "../types/Action";
import AIRule from "../types/AIRule";
import Combatant from "../types/Combatant";
import { describeDice } from "../utils/text";
import { isDefined } from "../utils/types";
import { HealAllies, HealSelf, OverHealAllies } from "./coefficients";

export default class HealingRule implements AIRule {
  evaluate(g: Engine, me: Combatant, actions: Action[]) {
    return actions.flatMap((action) => {
      const allies = Array.from(g.combatants.keys()).filter(
        (c) => c.side === me.side,
      );

      return action
        .generateHealingConfigs(allies)
        .filter((config) => g.check(action, config).result)
        .map((config) => {
          const amounts = action.getHeal(config);
          if (!amounts) return;

          const { average } = describeDice(amounts);
          const score = new EvaluationCollector();

          let effectiveSelf = 0;
          let effective = 0;
          let overHeal = 0;

          const targets = action.getTargets(config);
          if (!targets) return;

          for (const target of targets) {
            const missing = target.hpMax - target.hp;
            const heal = Math.min(average, missing);
            if (target === me) effectiveSelf += heal;
            else effective += heal;
            overHeal += Math.max(average - missing, 0);
          }

          score.addEval(me, effectiveSelf, HealSelf);
          score.addEval(me, effective, HealAllies);
          score.addEval(me, overHeal, OverHealAllies);

          return { action, config, score };
        })
        .filter(isDefined);
    });
  }
}
