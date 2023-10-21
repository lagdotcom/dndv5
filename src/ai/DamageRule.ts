import EvaluationCollector from "../collectors/EvaluationCollector";
import Engine from "../Engine";
import Action from "../types/Action";
import AIRule from "../types/AIRule";
import Combatant from "../types/Combatant";
import { checkConfig } from "../utils/config";
import { describeDice } from "../utils/text";
import { isDefined } from "../utils/types";
import { DamageAllies, DamageEnemies, OverKillEnemies } from "./coefficients";

export default class DamageRule implements AIRule {
  evaluate(g: Engine, me: Combatant, actions: Action[]) {
    const enemies = Array.from(g.combatants.keys()).filter(
      (who) => who.side !== me.side,
    );

    return actions.flatMap((action) =>
      action
        .generateAttackConfigs(enemies)
        .filter((config) => checkConfig(g, action, config))
        .map((config) => {
          // TODO this is very inaccurate for WeaponAttack (UI has same issue)
          const amounts = action.getDamage(config);
          if (!amounts) return;

          const targets = action.getTargets(config);
          if (!targets) return;

          const { average } = describeDice(amounts);
          const score = new EvaluationCollector();

          let effective = 0;
          let overKill = 0;
          let friendlyFire = 0;

          for (const target of targets) {
            // TODO cheating
            const remaining = target.hp;
            const damage = Math.min(average, remaining);
            if (target.side === me.side) friendlyFire += damage;
            else effective += damage;
            overKill += Math.max(average - remaining, 0);
          }

          score.addEval(me, effective, DamageEnemies);
          score.addEval(me, overKill, OverKillEnemies);
          score.addEval(me, friendlyFire, DamageAllies);

          return { action, config, score };
        })
        .filter(isDefined),
    );
  }
}
