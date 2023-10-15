import iconUrl from "@img/act/steady-aim.svg";

import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import { makeIcon } from "../../colours";
import Effect from "../../Effect";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import Combatant from "../../types/Combatant";
import { RogueIcon } from "./common";

const SteadyAimIcon = makeIcon(iconUrl);

const SteadyAimNoMoveEffect = new Effect(
  "Steady Aim",
  "turnEnd",
  (g) => {
    g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      if (who.hasEffect(SteadyAimNoMoveEffect))
        multiplier.add("zero", SteadyAimNoMoveEffect);
    });
  },
  { quiet: true },
);

const SteadyAimAdvantageEffect = new Effect(
  "Steady Aim",
  "turnEnd",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
      if (who.hasEffect(SteadyAimAdvantageEffect))
        diceType.add("advantage", SteadyAimAdvantageEffect);
    });

    g.events.on("Attack", ({ detail: { pre, interrupt } }) => {
      if (pre.diceType.isInvolved(SteadyAimAdvantageEffect))
        interrupt.add(
          new EvaluateLater(pre.who, SteadyAimAdvantageEffect, async () => {
            await pre.who.removeEffect(SteadyAimAdvantageEffect);
          }),
        );
    });
  },
  { icon: SteadyAimIcon },
);

class SteadyAimAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Steady Aim",
      "implemented",
      {},
      {
        icon: SteadyAimIcon,
        time: "bonus action",
        description: `As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.`,
      },
    );
    this.subIcon = RogueIcon;
  }

  check(config: never, ec: ErrorCollector) {
    if (this.actor.movedSoFar) ec.add("Already moved this turn", this);

    return super.check(config, ec);
  }

  async apply() {
    await super.apply({});

    await this.actor.addEffect(SteadyAimNoMoveEffect, { duration: 1 });
    await this.actor.addEffect(SteadyAimAdvantageEffect, { duration: 1 });
  }
}

const SteadyAim = new SimpleFeature(
  "Steady Aim",
  `As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new SteadyAimAction(g, me));
    });
  },
);
export default SteadyAim;
