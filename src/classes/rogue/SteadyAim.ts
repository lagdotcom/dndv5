import BaseEffect from "../../BaseEffect";
import ErrorCollector from "../../collectors/ErrorCollector";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import Action from "../../types/Action";
import ActionTime from "../../types/ActionTime";
import Combatant from "../../types/Combatant";

const SteadyAimNoMoveEffect = new BaseEffect("Steady Aim (No Move)", "turnEnd");

const SteadyAimAdvantageEffect = new BaseEffect(
  "Steady Aim (Advantage)",
  "turnEnd"
);

class SteadyAimAction implements Action<object> {
  config: object;
  name: string;
  time: ActionTime;

  constructor(public g: Engine, public actor: Combatant) {
    this.config = {};
    this.name = "Steady Aim";
    this.time = "bonus action";
  }

  getAffectedArea() {
    return undefined;
  }

  check(config: never, ec = new ErrorCollector()) {
    if (!this.actor.time.has("bonus action"))
      ec.add("No bonus action left", this);

    if (this.actor.movedSoFar) ec.add("Already moved this turn", this);

    return ec;
  }

  async apply() {
    this.actor.time.delete("bonus action");

    this.actor.addEffect(SteadyAimNoMoveEffect, 1);
    this.actor.addEffect(SteadyAimAdvantageEffect, 1);
  }
}

const SteadyAim = new SimpleFeature("Steady Aim", (g, me) => {
  g.events.on("getActions", ({ detail: { who, actions } }) => {
    if (who === me) actions.push(new SteadyAimAction(g, me));
  });

  // TODO this doesn't work yet
  g.events.on("getSpeed", ({ detail: { who, multiplier } }) => {
    if (who.hasEffect(SteadyAimNoMoveEffect))
      multiplier.add(0, SteadyAimNoMoveEffect);
  });

  g.events.on("beforeAttack", ({ detail: { attacker, diceType } }) => {
    if (attacker.hasEffect(SteadyAimAdvantageEffect))
      diceType.add("advantage", SteadyAimAdvantageEffect);
  });

  g.events.on("attack", ({ detail: { pre } }) => {
    if (pre.diceType.involved(SteadyAimAdvantageEffect))
      pre.attacker.removeEffect(SteadyAimAdvantageEffect);
  });
});
export default SteadyAim;
