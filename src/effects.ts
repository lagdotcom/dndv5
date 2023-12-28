import dyingUrl from "@img/act/dying.svg";
import proneUrl from "@img/act/prone.svg";
import charmedUrl from "@img/spl/charm-monster.svg";

import AbstractAction from "./actions/AbstractAction";
import DropProneAction from "./actions/DropProneAction";
import EscapeGrappleAction from "./actions/EscapeGrappleAction";
import StabilizeAction from "./actions/StabilizeAction";
import StandUpAction from "./actions/StandUpAction";
import { makeIcon } from "./colours";
import { HasTarget } from "./configs";
import Effect from "./Effect";
import Engine from "./Engine";
import { hasEffect } from "./filters";
import EvaluateLater from "./interruptions/EvaluateLater";
import YesNoChoice from "./interruptions/YesNoChoice";
import TargetResolver from "./resolvers/TargetResolver";
import { atSet } from "./types/AttackTag";
import Combatant from "./types/Combatant";
import { EffectConfig } from "./types/EffectType";
import Point from "./types/Point";
import Priority from "./types/Priority";
import { sieve } from "./utils/array";
import { addPoints, subPoints } from "./utils/points";
import { distance } from "./utils/units";

export const Dying = new Effect(
  "Dying",
  "turnStart",
  (g) => {
    g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
      if (who.hasEffect(Dying)) {
        conditions.add("Incapacitated", Dying);
        conditions.add("Prone", Dying);
        conditions.add("Unconscious", Dying);
      }
    });

    g.events.on("TurnSkipped", ({ detail: { who, interrupt } }) => {
      /* Whenever you start your turn with 0 hit points, you must make a special saving throw, called a death saving throw, to determine whether you creep closer to death or hang onto life. Unlike other saving throws, this one isn't tied to any ability score. You are in the hands of fate now, aided only by spells and features that improve your chances of succeeding on a saving throw.

      Roll a d20. If the roll is 10 or higher, you succeed. Otherwise, you fail. A success or failure has no effect by itself. On your third success, you become stable (see below). On your third failure, you die. The successes and failures don't need to be consecutive; keep track of both until you collect three of a kind. The number of both is reset to zero when you regain any hit points or become stable.

      Rolling 1 or 20. When you make a death saving throw and roll a 1 on the d20, it counts as two failures. If you roll a 20 on the d20, you regain 1 hit point. */
      if (who.hasEffect(Dying))
        interrupt.add(
          new EvaluateLater(who, Dying, Priority.ChangesOutcome, async () => {
            const {
              outcome,
              roll: { values },
            } = await g.save({
              source: Dying,
              type: { type: "flat", dc: 10 },
              who,
              tags: ["death"],
            });

            if (values.final === 20) await g.heal(Dying, 1, { target: who });
            else if (values.final === 1) await g.failDeathSave(who, 2);
            else if (outcome === "fail") await g.failDeathSave(who);
            else await g.succeedDeathSave(who);
          }),
        );
    });

    g.events.on("CombatantHealed", ({ detail: { who, interrupt } }) => {
      // This unconsciousness ends if you regain any hit points.
      if (who.hasEffect(Dying))
        interrupt.add(
          new EvaluateLater(who, Dying, Priority.ChangesOutcome, async () => {
            who.deathSaveFailures = 0;
            who.deathSaveSuccesses = 0;
            await who.removeEffect(Dying);
            await who.addEffect(Prone, { duration: Infinity });
          }),
        );
    });

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      const dying = Array.from(g.combatants).find((other) =>
        other.hasEffect(Dying),
      );
      if (dying) actions.push(new StabilizeAction(g, who));
    });
  },
  { icon: makeIcon(dyingUrl, "red") },
);

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
        new EvaluateLater(who, Stable, Priority.ChangesOutcome, async () => {
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

    g.events.on("GatherHeal", ({ detail: { target, multiplier } }) => {
      // A creature that has died can't regain hit points until magic such as the revivify spell has restored it to life.
      if (target.hasEffect(Dead)) multiplier.add("zero", Dead);
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

export const Prone = new Effect(
  "Prone",
  "turnEnd",
  (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(Prone)) conditions.add("Prone", Prone);
    });

    // A prone creature's only movement option is to crawl...
    g.events.on("GetMoveCost", ({ detail: { who, multiplier } }) => {
      if (who.conditions.has("Prone")) multiplier.add("double", Prone);
    });
    // ...unless it stands up and thereby ends the condition.
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      actions.push(
        who.conditions.has("Prone")
          ? new StandUpAction(g, who)
          : new DropProneAction(g, who),
      );
    });

    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      // The creature has disadvantage on attack rolls.
      if (who.conditions.has("Prone")) diceType.add("disadvantage", Prone);

      // An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.
      if (target.conditions.has("Prone")) {
        const d = distance(who, target);
        diceType.add(d <= 5 ? "advantage" : "disadvantage", Prone);
      }
    });
  },
  { icon: makeIcon(proneUrl) },
);

export type CharmedConfig = EffectConfig<{ by: Combatant }>;

export const Charmed = new Effect<{ by: Combatant }>(
  "Charmed",
  "turnEnd",
  (g) => {
    // A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects.
    g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
      const charm = action.actor.getEffectConfig(Charmed);
      const targets = action.getTargets(config) ?? [];

      if (charm?.by && targets.includes(charm.by) && action.tags.has("harmful"))
        error.add(
          "can't attack the charmer or target the charmer with harmful abilities or magical effects",
          Charmed,
        );
    });

    // The charmer has advantage on any ability check to interact socially with the creature.
    g.events.on(
      "BeforeCheck",
      ({ detail: { target, who, tags, diceType } }) => {
        const charm = target?.getEffectConfig(Charmed);

        if (charm?.by === who && tags.has("social"))
          diceType.add("advantage", Charmed);
      },
    );
  },
  { icon: makeIcon(charmedUrl), tags: ["magic"] },
);

export const Grappled = new Effect<{ by: Combatant }>(
  "Grappled",
  "turnEnd",
  (g) => {
    const grappleRemover = (who: Combatant) =>
      new EvaluateLater(who, Grappled, Priority.Normal, () =>
        who.removeEffect(Grappled),
      );

    const grappleMover = (
      who: Combatant,
      grappled: Combatant,
      displacement: Point,
    ) =>
      new YesNoChoice(
        who,
        Grappled,
        "Grapple",
        `Should ${who.name} drag ${grappled.name} as they move?`,
        Priority.ChangesOutcome,
        async () => {
          const destination = addPoints(grappled.position, displacement);
          await g.move(grappled, destination, {
            name: "Drag",
            forced: true,
            maximum: 5,
            mustUseAll: false,
            provokesOpportunityAttacks: false,
            teleportation: false,
            turnMovement: false,
            onMove: () => true,
          });
        },
        async () => {
          if (distance(who, grappled) > who.reach)
            await grappled.removeEffect(Grappled);
        },
      );

    g.events.on("GetConditions", ({ detail: { who, grappling } }) => {
      for (const other of g.combatants) {
        const config = other.getEffectConfig(Grappled);
        if (config?.by === who) grappling.add(other);
      }
    });

    // The condition ends if the grappler is incapacitated.
    g.events.on("AfterAction", ({ detail: { interrupt } }) => {
      for (const who of g.combatants) {
        const config = who.getEffectConfig(Grappled);
        if (config?.by.conditions.has("Incapacitated"))
          interrupt.add(grappleRemover(who));
      }
    });

    // The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect, such as when a creature is hurled away by the thunderwave spell.
    g.events.on(
      "CombatantMoved",
      ({ detail: { who, handler, interrupt, old, position } }) => {
        const config = who.getEffectConfig(Grappled);
        if (
          config &&
          handler.forced &&
          distance(who, config.by) > config.by.reach
        )
          interrupt.add(grappleRemover(who));

        // When you move, you can drag or carry the grappled creature with you[...]
        const displacement = subPoints(position, old);
        for (const grappled of who.grappling)
          interrupt.add(grappleMover(who, grappled, displacement));
      },
    );

    // A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed.
    // When you move, you can drag or carry the grappled creature with you, but your speed is halved, unless the creature is two or more sizes smaller than you.
    g.events.on("GetSpeed", ({ detail: { who, multiplier, bonus } }) => {
      if (who.hasEffect(Grappled)) {
        multiplier.add("zero", Grappled);
        bonus.ignoreAll();
        return;
      }

      for (const grappled of who.grappling) {
        if (who.size - grappled.size < 2) {
          multiplier.add("half", Grappled);
          return;
        }
      }
    });

    // A grappled creature can use its action to escape.
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who.hasEffect(Grappled))
        actions.push(new EscapeGrappleAction(g, who));
    });
  },
);

class DouseFireAction extends AbstractAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Douse Fire",
      "implemented",
      { target: new TargetResolver(g, actor.reach, [hasEffect(OnFire)]) },
      {
        time: "action",
        description: `Until a creature takes an action to douse the fire, the target takes 5 (1d10) fire damage at the start of each of its turns.`,
      },
    );
  }

  getTargets({ target }: Partial<HasTarget>) {
    return sieve(target);
  }
  getAffected({ target }: HasTarget) {
    return [target];
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    await target.removeEffect(OnFire);
  }
}

export const OnFire = new Effect(
  "On Fire",
  "turnEnd",
  (g) => {
    // Until a creature takes an action to douse the fire, the target takes 5 (1d10) fire damage at the start of each of its turns.
    g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
      if (who.hasEffect(OnFire))
        interrupt.add(
          new EvaluateLater(who, OnFire, Priority.ChangesOutcome, async () => {
            const damage = await g.rollDamage(1, {
              size: 10,
              damageType: "fire",
              source: OnFire,
              tags: atSet(),
            });
            await g.damage(OnFire, "fire", { target: who }, [["fire", damage]]);
          }),
        );
    });

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      for (const other of g.combatants)
        if (other.hasEffect(OnFire)) {
          actions.push(new DouseFireAction(g, who));
          return;
        }
    });
  },
  { tags: ["fire"] },
);

export const Surprised = new Effect("Surprised", "turnStart");
