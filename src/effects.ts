import AbstractAction from "./actions/AbstractAction";
import ErrorCollector from "./collectors/ErrorCollector";
import Effect from "./Effect";
import Engine from "./Engine";
import EvaluateLater from "./interruptions/EvaluateLater";
import Combatant from "./types/Combatant";
import { coSet } from "./types/ConditionName";
import { svSet } from "./types/SaveTag";
import { distance } from "./utils/units";

export const Dying = new Effect("Dying", "turnStart", (g) => {
  g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
    if (who.hasEffect(Dying)) {
      conditions.add("Incapacitated", Dying);
      conditions.add("Prone", Dying);
      conditions.add("Unconscious", Dying);
    }
  });

  g.events.on("TurnSkipped", ({ detail: { who, interrupt } }) => {
    if (who.hasEffect(Dying))
      interrupt.add(
        new EvaluateLater(who, Dying, async () => {
          const result = await g.savingThrow(10, { who, tags: svSet("death") });

          if (result.roll.value === 20) await g.heal(Dying, 1, { target: who });
          else if (result.roll.value === 1) await g.failDeathSave(who, 2);
          else if (result.outcome === "fail") await g.failDeathSave(who);
          else await g.succeedDeathSave(who);
        }),
      );
  });

  g.events.on("CombatantHealed", ({ detail: { who, interrupt } }) => {
    if (who.hasEffect(Dying))
      interrupt.add(
        new EvaluateLater(who, Dying, async () => {
          who.deathSaveFailures = 0;
          who.deathSaveSuccesses = 0;
          await who.removeEffect(Dying);
          await who.addEffect(Prone, { duration: Infinity });
        }),
      );
  });
});

export const Stable = new Effect("Stable", "turnStart", (g) => {
  g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
    if (who.hasEffect(Stable)) {
      conditions.add("Incapacitated", Stable);
      conditions.add("Prone", Stable);
      conditions.add("Unconscious", Stable);
    }
  });

  g.events.on("CombatantHealed", ({ detail: { who, interrupt } }) => {
    if (who.hasEffect(Stable))
      interrupt.add(
        new EvaluateLater(who, Stable, async () => {
          await who.removeEffect(Stable);
          await who.addEffect(Prone, { duration: Infinity });
        }),
      );
  });
});

export const Dead = new Effect(
  "Dead",
  "turnStart",
  (g) => {
    g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
      if (who.hasEffect(Dead)) {
        conditions.add("Incapacitated", Dead);
        conditions.add("Prone", Dead);
        conditions.add("Unconscious", Dead);
      }
    });
  },
  { quiet: true },
);

export const UsedAttackAction = new Effect(
  "Used Attack Action",
  "turnStart",
  undefined,
  { quiet: true },
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

    await this.actor.addEffect(Prone, {
      conditions: coSet("Prone"),
      duration: Infinity,
    });
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

    // TODO [MESSAGES] report this somehow
    await this.actor.removeEffect(Prone);
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
        : new DropProneAction(g, who),
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
