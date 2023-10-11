import DashAction from "./actions/DashAction";
import DisengageAction from "./actions/DisengageAction";
import DodgeAction from "./actions/DodgeAction";
import OpportunityAttack from "./actions/OpportunityAttack";
import WeaponAttack from "./actions/WeaponAttack";
import DndRule, { RuleRepository } from "./DndRule";
import Engine from "./Engine";
import EvaluateLater from "./interruptions/EvaluateLater";
import PickFromListChoice from "./interruptions/PickFromListChoice";
import PointSet from "./PointSet";
import { ResourceRegistry } from "./resources";
import Combatant from "./types/Combatant";
import Item from "./types/Item";
import Point from "./types/Point";
import { resolveArea } from "./utils/areas";
import { getValidAmmunition } from "./utils/items";
import { compareDistances, distance, getSquares } from "./utils/units";

export const AbilityScoreRule = new DndRule("Ability Score", (g) => {
  g.events.on("BeforeAttack", ({ detail: { who, ability, bonus } }) => {
    if (ability) bonus.add(who[ability].modifier, AbilityScoreRule);
  });
  g.events.on("BeforeCheck", ({ detail: { who, ability, bonus } }) => {
    bonus.add(who[ability].modifier, AbilityScoreRule);
  });
  g.events.on("BeforeSave", ({ detail: { who, ability, bonus } }) => {
    if (ability) bonus.add(who[ability].modifier, AbilityScoreRule);
  });

  g.events.on("GatherDamage", ({ detail: { attacker, ability, bonus } }) => {
    if (ability) bonus.add(attacker[ability].modifier, AbilityScoreRule);
  });

  g.events.on("GetInitiative", ({ detail: { who, bonus } }) => {
    bonus.add(who.dex.modifier, AbilityScoreRule);
  });
});

export const ArmorCalculationRule = new DndRule("Armor Calculation", (g) => {
  g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
    const { armor, dex, shield } = who;
    const armorAC = armor?.ac ?? 10;
    const shieldAC = shield?.ac ?? 0;

    const uses = new Set<Item>();
    if (armor) uses.add(armor);
    if (shield) uses.add(shield);

    const name = armor ? `${armor.category} armor` : "unarmored";
    const dexMod =
      armor?.category === "medium"
        ? Math.min(dex.modifier, 2)
        : armor?.category === "heavy"
        ? 0
        : dex.modifier;
    methods.push({ name, ac: armorAC + dexMod + shieldAC, uses });
  });
});

export const BlindedRule = new DndRule("Blinded", (g) => {
  g.events.on("BeforeAttack", ({ detail: { who, diceType, target } }) => {
    if (who.conditions.has("Blinded"))
      diceType.add("disadvantage", BlindedRule);
    if (target.conditions.has("Blinded"))
      diceType.add("advantage", BlindedRule);
  });
});

export const CombatActionsRule = new DndRule("Combat Actions", (g) => {
  g.events.on("GetActions", ({ detail: { who, actions } }) => {
    actions.push(new DashAction(g, who));
    actions.push(new DisengageAction(g, who));
    actions.push(new DodgeAction(g, who));
  });
});

export const DifficultTerrainRule = new DndRule("Difficult Terrain", (g) => {
  const isDifficultTerrainAnywhere = (squares: PointSet) => {
    for (const effect of g.effects) {
      if (!effect.tags.has("difficult terrain")) continue;

      const area = resolveArea(effect.shape);
      for (const square of squares) {
        if (area.has(square)) return true;
      }
    }

    return false;
  };

  g.events.on("GetMoveCost", ({ detail: { who, to, multiplier } }) => {
    const squares = getSquares(who, to);
    if (isDifficultTerrainAnywhere(squares))
      multiplier.add("double", DifficultTerrainRule);
  });
});

export const EffectsRule = new DndRule("Effects", (g) => {
  g.events.on("TurnStarted", ({ detail: { who } }) =>
    who.tickEffects("turnStart"),
  );

  g.events.on("TurnEnded", ({ detail: { who } }) => who.tickEffects("turnEnd"));
});

export const ExhaustionRule = new DndRule("Exhaustion", (g) => {
  g.events.on("BeforeCheck", ({ detail: { who, diceType } }) => {
    if (who.exhaustion >= 1) diceType.add("disadvantage", ExhaustionRule);
  });

  g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
    if (who.exhaustion >= 2) multiplier.add("half", ExhaustionRule);
    if (who.exhaustion >= 5) multiplier.add("zero", ExhaustionRule);
  });

  g.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
    if (who.exhaustion >= 3) diceType.add("disadvantage", ExhaustionRule);
  });
  g.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
    if (who.exhaustion >= 3) diceType.add("disadvantage", ExhaustionRule);
  });

  g.events.on("GetMaxHP", ({ detail: { who, multiplier } }) => {
    if (who.exhaustion >= 4) multiplier.add("half", ExhaustionRule);
  });

  g.events.on("Exhaustion", ({ detail: { who, interrupt } }) => {
    if (who.exhaustion >= 6)
      interrupt.add(
        new EvaluateLater(who, ExhaustionRule, async () => g.kill(who)),
      );
  });
});

export const IncapacitatedRule = new DndRule("Incapacitated", (g) => {
  g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
    if (
      action.actor.conditions.has("Incapacitated") &&
      (action.isAttack || action.getTime(config))
    )
      error.add("incapacitated", IncapacitatedRule);
  });
});

export const LongRangeAttacksRule = new DndRule("Long Range Attacks", (g) => {
  g.events.on(
    "BeforeAttack",
    ({ detail: { who, target, weapon, diceType } }) => {
      if (
        typeof weapon?.shortRange === "number" &&
        distance(g, who, target) > weapon.shortRange
      )
        diceType.add("disadvantage", LongRangeAttacksRule);
    },
  );
});

export const ObscuredRule = new DndRule("Obscured", (g) => {
  const isHeavilyObscuredAnywhere = (squares: PointSet) => {
    for (const effect of g.effects) {
      if (!effect.tags.has("heavily obscured")) continue;

      const area = resolveArea(effect.shape);
      for (const square of squares) {
        if (area.has(square)) return true;
      }
    }

    return false;
  };

  // TODO [PROJECTILE] should really check anywhere along the path...
  g.events.on("BeforeAttack", ({ detail: { diceType, target } }) => {
    const squares = getSquares(target, g.getState(target).position);
    if (isHeavilyObscuredAnywhere(squares))
      diceType.add("disadvantage", ObscuredRule);
  });

  g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
    const squares = getSquares(who, g.getState(who).position);
    if (isHeavilyObscuredAnywhere(squares))
      conditions.add("Blinded", ObscuredRule);
  });
});

export const OneAttackPerTurnRule = new DndRule("Attacks per turn", (g) => {
  g.events.on("CheckAction", ({ detail: { action, error } }) => {
    if (action.isAttack && action.actor.attacksSoFar.length)
      error.add("No attacks left", OneAttackPerTurnRule);
  });
});

function getValidOpportunityAttacks(
  g: Engine,
  attacker: Combatant,
  position: Point,
  target: Combatant,
  from: Point,
  to: Point,
) {
  const { oldDistance, newDistance } = compareDistances(
    attacker,
    position,
    target,
    from,
    to,
  );

  return attacker.weapons
    .filter((weapon) => weapon.rangeCategory === "melee")
    .filter((weapon) => {
      const range = attacker.reach + weapon.reach;
      return oldDistance <= range && newDistance > range;
    })
    .map((weapon) => new OpportunityAttack(g, attacker, weapon))
    .filter((opportunity) => g.check(opportunity, { target }).result);
}

export const OpportunityAttacksRule = new DndRule(
  "Opportunity Attacks",
  (g) => {
    g.events.on(
      "BeforeMove",
      ({ detail: { handler, who, from, to, interrupt } }) => {
        if (!handler.provokesOpportunityAttacks) return;

        for (const [attacker, { position }] of g.combatants) {
          if (attacker.side === who.side) continue;

          const validActions = getValidOpportunityAttacks(
            g,
            attacker,
            position,
            who,
            from,
            to,
          );
          if (validActions.length)
            interrupt.add(
              new PickFromListChoice(
                attacker,
                OpportunityAttacksRule,
                "Opportunity Attack",
                `${who.name} is moving out of ${attacker.name}'s reach. Make an opportunity attack?`,
                validActions.map((value) => ({
                  label: value.weapon.name,
                  value,
                })),
                async (opportunity) => {
                  await g.act(opportunity, { target: who });
                },
                true,
              ),
            );
        }
      },
    );
  },
);

export const ParalyzedRule = new DndRule("Paralyzed", (g) => {
  g.events.on("BeforeMove", ({ detail: { who, error } }) => {
    if (who.conditions.has("Paralyzed")) error.add("paralyzed", ParalyzedRule);
  });

  g.events.on("CheckAction", ({ detail: { action, error } }) => {
    if (action.actor.conditions.has("Paralyzed") && action.vocal)
      error.add("paralyzed", ParalyzedRule);
  });

  g.events.on("BeforeSave", ({ detail: { ability, who, successResponse } }) => {
    if (
      who.conditions.has("Paralyzed") &&
      (ability === "str" || ability === "dex")
    )
      successResponse.add("fail", ParalyzedRule);
  });

  g.events.on("BeforeAttack", ({ detail }) => {
    if (detail.target.conditions.has("Paralyzed"))
      detail.diceType.add("advantage", ParalyzedRule);
  });

  g.events.on("Attack", ({ detail }) => {
    const { who, target } = detail.pre;

    if (
      target.conditions.has("Paralyzed") &&
      distance(g, who, target) <= 5 &&
      detail.outcome === "hit"
    ) {
      // TODO is this completely safe?
      detail.forced = true;
      detail.outcome = "critical";
    }
  });
});

export const ProficiencyRule = new DndRule("Proficiency", (g) => {
  g.events.on("BeforeAttack", ({ detail: { who, bonus, spell, weapon } }) => {
    const mul = weapon ? who.getProficiencyMultiplier(weapon) : spell ? 1 : 0;
    bonus.add(who.pb * mul, ProficiencyRule);
  });
  g.events.on("BeforeCheck", ({ detail: { who, skill, bonus } }) => {
    if (skill) {
      const mul = who.getProficiencyMultiplier(skill);
      bonus.add(who.pb * mul, ProficiencyRule);
    }
  });
  g.events.on("BeforeSave", ({ detail: { who, ability, bonus } }) => {
    if (ability) {
      const mul = who.getProficiencyMultiplier(ability);
      bonus.add(who.pb * mul, ProficiencyRule);
    }
  });
});

export const ResourcesRule = new DndRule("Resources", (g) => {
  g.events.on("TurnStarted", ({ detail: { who } }) => {
    for (const name of who.resources.keys()) {
      const resource = ResourceRegistry.get(name);
      if (resource?.refresh === "turnStart") who.refreshResource(resource);
    }
  });
});

export const RestrainedRule = new DndRule("Restrained", (g) => {
  g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
    if (who.conditions.has("Restrained"))
      multiplier.add("zero", RestrainedRule);
  });
  g.events.on("BeforeAttack", ({ detail: { who, diceType, target } }) => {
    if (who.conditions.has("Restrained"))
      diceType.add("disadvantage", RestrainedRule);
    if (target.conditions.has("Restrained"))
      diceType.add("advantage", RestrainedRule);
  });
  g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
    if (who.conditions.has("Restrained") && ability === "dex")
      diceType.add("disadvantage", RestrainedRule);
  });
});

export const TurnTimeRule = new DndRule("Turn Time", (g) => {
  g.events.on("TurnStarted", ({ detail: { who } }) => {
    who.time.add("action");
    who.time.add("bonus action");
    who.time.add("reaction");
  });
});

export const WeaponAttackRule = new DndRule("Weapon Attacks", (g) => {
  g.events.on("GetActions", ({ detail: { who, target, actions } }) => {
    if (who !== target) {
      for (const weapon of who.weapons) {
        if (weapon.ammunitionTag) {
          for (const ammo of getValidAmmunition(who, weapon)) {
            actions.push(new WeaponAttack(g, who, weapon, ammo));
          }
        } else actions.push(new WeaponAttack(g, who, weapon));
      }
    }
  });
});

export default class DndRules {
  constructor(public g: Engine) {
    for (const rule of RuleRepository) rule.setup(g);
  }
}
