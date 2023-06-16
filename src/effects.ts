import AbstractAction from "./actions/AbstractAction";
import ErrorCollector from "./collectors/ErrorCollector";
import Effect from "./Effect";
import Engine from "./Engine";
import Combatant from "./types/Combatant";
import { distance } from "./utils/units";

export const Dead = new Effect("Dead", "turnStart", undefined, true);
export const UsedAttackAction = new Effect(
  "Used Attack Action",
  "turnStart",
  undefined,
  true
);

class DropProneAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Drop Prone", "implemented", {});
  }

  check(config: never, ec: ErrorCollector) {
    if (this.actor.conditions.has("Prone")) ec.add("already prone", this);

    return super.check(config, ec);
  }

  async apply() {
    super.apply({});

    this.actor.addEffect(Prone, { duration: Infinity });
  }
}

class StandUpAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Stand Up", "implemented", {});
  }

  check(config: never, ec: ErrorCollector) {
    if (!this.actor.conditions.has("Prone")) ec.add("not prone", this);

    const speed = this.actor.speed;
    if (speed <= 0) ec.add("cannot move", this);
    else if (this.actor.movedSoFar > speed / 2)
      ec.add("not enough movement", this);

    return super.check(config, ec);
  }

  async apply() {
    super.apply({});

    const speed = this.actor.speed;
    this.actor.movedSoFar += speed / 2;

    // TODO [MESSAGE] report this somehow
    this.actor.removeEffect(Prone);
  }
}

export const Prone = new Effect("Prone", "turnEnd", (g) => {
  g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
    if (who.hasEffect(Prone)) conditions.add("Prone", Prone);
  });

  g.events.on("GetActions", ({ detail: { who, actions } }) => {
    actions.push(
      who.conditions.has("Prone")
        ? new StandUpAction(g, who)
        : new DropProneAction(g, who)
    );
  });

  g.events.on("GetMoveCost", ({ detail: { who, multiplier } }) => {
    if (who.conditions.has("Prone")) multiplier.add("double", Prone);
  });

  g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
    // The creature has disadvantage on attack rolls.
    if (who.conditions.has("Prone")) diceType.add("disadvantage", Prone);

    // An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.
    if (target.conditions.has("Prone")) {
      const d = distance(g, who, target);
      diceType.add(d <= 5 ? "advantage" : "disadvantage", Prone);
    }
  });
});
