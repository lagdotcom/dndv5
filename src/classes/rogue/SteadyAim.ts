import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import Effect from "../../Effect";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import Combatant from "../../types/Combatant";

const SteadyAimNoMoveEffect = new Effect(
  "Steady Aim",
  "turnEnd",
  (g) => {
    g.events.on("getSpeed", ({ detail: { who, multiplier } }) => {
      if (who.hasEffect(SteadyAimNoMoveEffect))
        multiplier.add(0, SteadyAimNoMoveEffect);
    });
  },
  true
);

const SteadyAimAdvantageEffect = new Effect("Steady Aim", "turnEnd", (g) => {
  g.events.on("beforeAttack", ({ detail: { who, diceType } }) => {
    if (who.hasEffect(SteadyAimAdvantageEffect))
      diceType.add("advantage", SteadyAimAdvantageEffect);
  });

  g.events.on("attack", ({ detail: { pre } }) => {
    if (pre.diceType.involved(SteadyAimAdvantageEffect))
      pre.who.removeEffect(SteadyAimAdvantageEffect);
  });
});

class SteadyAimAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Steady Aim", {}, "bonus action");
  }

  check(config: never, ec = new ErrorCollector()) {
    if (this.actor.movedSoFar) ec.add("Already moved this turn", this);

    return super.check(config, ec);
  }

  async apply() {
    super.apply({});

    this.actor.addEffect(SteadyAimNoMoveEffect, 1);
    this.actor.addEffect(SteadyAimAdvantageEffect, 1);
  }
}

const SteadyAim = new SimpleFeature(
  "Steady Aim",
  `As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.`,
  (g, me) => {
    g.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new SteadyAimAction(g, me));
    });
  }
);
export default SteadyAim;
