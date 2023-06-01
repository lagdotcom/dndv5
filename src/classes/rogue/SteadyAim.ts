import ErrorCollector from "../../collectors/ErrorCollector";
import Effect from "../../Effect";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import Action from "../../types/Action";
import ActionTime from "../../types/ActionTime";
import Combatant from "../../types/Combatant";

const SteadyAimNoMoveEffect = new Effect(
  "Steady Aim (No Move)",
  "turnEnd",
  (g) => {
    g.events.on("getSpeed", ({ detail: { who, multiplier } }) => {
      if (who.hasEffect(SteadyAimNoMoveEffect))
        multiplier.add(0, SteadyAimNoMoveEffect);
    });
  }
);

const SteadyAimAdvantageEffect = new Effect(
  "Steady Aim (Advantage)",
  "turnEnd",
  (g) => {
    g.events.on("beforeAttack", ({ detail: { who, diceType } }) => {
      if (who.hasEffect(SteadyAimAdvantageEffect))
        diceType.add("advantage", SteadyAimAdvantageEffect);
    });

    g.events.on("attack", ({ detail: { pre } }) => {
      if (pre.diceType.involved(SteadyAimAdvantageEffect))
        pre.who.removeEffect(SteadyAimAdvantageEffect);
    });
  }
);

class SteadyAimAction implements Action<object> {
  name: string;
  time: ActionTime;

  constructor(public g: Engine, public actor: Combatant) {
    this.name = "Steady Aim";
    this.time = "bonus action";
  }

  getAffectedArea() {
    return undefined;
  }

  getConfig() {
    return {};
  }

  getDamage() {
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
