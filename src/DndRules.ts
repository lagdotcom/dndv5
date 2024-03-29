import { isCastSpell } from "./actions/CastSpell";
import DashAction from "./actions/DashAction";
import DisengageAction from "./actions/DisengageAction";
import DodgeAction from "./actions/DodgeAction";
import DoffAction from "./actions/DoffAction";
import DonAction from "./actions/DonAction";
import GrappleAction from "./actions/GrappleAction";
import OpportunityAttack from "./actions/OpportunityAttack";
import ReleaseGrappleAction from "./actions/ReleaseGrappleAction";
import ShoveAction from "./actions/ShoveAction";
import { TwoWeaponAttack } from "./actions/TwoWeaponAttack";
import WeaponAttack, {
  meleeWeaponAttack,
  rangedWeaponAttack,
  thrownWeaponAttack,
} from "./actions/WeaponAttack";
import DndRule, { RuleRepository } from "./DndRule";
import Engine from "./Engine";
import { Listener } from "./events/Dispatcher";
import EvaluateLater from "./interruptions/EvaluateLater";
import PickFromListChoice from "./interruptions/PickFromListChoice";
import PointSet from "./PointSet";
import { ResourceRegistry } from "./resources";
import AbilityName from "./types/AbilityName";
import Combatant from "./types/Combatant";
import ConditionName from "./types/ConditionName";
import Item from "./types/Item";
import Point from "./types/Point";
import Priority from "./types/Priority";
import Source from "./types/Source";
import { resolveArea } from "./utils/areas";
import { checkConfig } from "./utils/config";
import { getValidAmmunition, getWeaponRange } from "./utils/items";
import { isDefined } from "./utils/types";
import { compareDistances, distance, getSquares } from "./utils/units";

export const AbilityScoreRule = new DndRule("Ability Score", (g) => {
  g.events.on("BeforeAttack", ({ detail: { who, ability, bonus, tags } }) => {
    if (ability) {
      const modifier = who[ability].modifier;

      // [Two-Weapon Fighting] You don't add your ability modifier to the damage of the bonus attack, unless that modifier is negative.
      if (modifier < 0 || !tags.has("two-weapon"))
        bonus.add(who[ability].modifier, AbilityScoreRule);
    }
  });
  g.events.on("BeforeCheck", ({ detail: { who, ability, bonus } }) => {
    bonus.add(who[ability].modifier, AbilityScoreRule);
  });
  g.events.on("BeforeSave", ({ detail: { who, ability, bonus } }) => {
    if (ability) bonus.add(who[ability].modifier, AbilityScoreRule);
  });

  g.events.on("GatherDamage", ({ detail: { attacker, ability, bonus } }) => {
    if (attacker && ability)
      bonus.add(attacker[ability].modifier, AbilityScoreRule);
  });

  g.events.on("GetInitiative", ({ detail: { who, bonus } }) => {
    bonus.add(who.dex.modifier, AbilityScoreRule);
  });

  g.events.on("GetSaveDC", ({ detail: { type, bonus, who } }) => {
    if (type.type === "ability" && who)
      bonus.add(who[type.ability].modifier, AbilityScoreRule);
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
    methods.push({
      name,
      ac: armorAC + dexMod + shieldAC,
      uses,
    });
  });
});

export const ArmorProficiencyRule = new DndRule("Armor Proficiency", (g) => {
  // If you wear armor that you lack proficiency with, you have disadvantage on any ability check, saving throw, or attack roll that involves Strength or Dexterity, and you can’t cast spells.
  const lacksArmorProficiency = (who: Combatant) =>
    !!(who.armor && who.getProficiency(who.armor) !== "proficient");

  g.events.on("BeforeCheck", ({ detail: { who, diceType } }) => {
    if (lacksArmorProficiency(who))
      diceType.add("disadvantage", ArmorProficiencyRule);
  });
  g.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
    if (lacksArmorProficiency(who))
      diceType.add("disadvantage", ArmorProficiencyRule);
  });
  g.events.on("BeforeAttack", ({ detail: { who, diceType, ability } }) => {
    if (lacksArmorProficiency(who) && (ability === "str" || ability === "dex"))
      diceType.add("disadvantage", ArmorProficiencyRule);
  });
  g.events.on("CheckAction", ({ detail: { action, error } }) => {
    if (action.tags.has("spell") && lacksArmorProficiency(action.actor))
      error.add("not proficient", ArmorProficiencyRule);
  });
});

export const BlindedRule = new DndRule("Blinded", (g) => {
  // A blinded creature can't see...
  g.events.on("CheckVision", ({ detail: { who, error } }) => {
    if (who.conditions.has("Blinded")) error.add("cannot see", BlindedRule);
  });
  // ...and automatically fails any ability check that requires sight.
  g.events.on("BeforeCheck", ({ detail: { who, tags, successResponse } }) => {
    if (who.conditions.has("Blinded") && tags.has("sight"))
      successResponse.add("fail", BlindedRule);
  });

  g.events.on("BeforeAttack", ({ detail: { who, diceType, target } }) => {
    // Attack rolls against the creature have advantage...
    if (target.conditions.has("Blinded"))
      diceType.add("advantage", BlindedRule);
    // ...and the creature's attack rolls have disadvantage.
    if (who.conditions.has("Blinded"))
      diceType.add("disadvantage", BlindedRule);
  });
});

export const CloseCombatRule = new DndRule("Close Combat", (g) => {
  // Aiming a ranged attack is more difficult when a foe is next to you. When you make a ranged attack with a weapon, a spell, or some other means, you have disadvantage on the attack roll if you are within 5 feet of a hostile creature who can see you and who isn't incapacitated.
  g.events.on("BeforeAttack", ({ detail: { tags, who, diceType } }) => {
    if (tags.has("ranged")) {
      let threatened = false;
      for (const other of g.combatants) {
        if (
          other.side !== who.side &&
          distance(who, other) <= 5 &&
          g.canSee(other, who) &&
          !other.conditions.has("Incapacitated")
        ) {
          threatened = true;
          break;
        }
      }

      if (threatened) diceType.add("disadvantage", CloseCombatRule);
    }
  });
});

export const CombatActionsRule = new DndRule("Combat Actions", (g) => {
  g.events.on("GetActions", ({ detail: { who, actions } }) => {
    actions.push(new DashAction(g, who));
    actions.push(new DisengageAction(g, who));
    actions.push(new DodgeAction(g, who));

    actions.push(new GrappleAction(g, who));
    if (who.grappling.size) actions.push(new ReleaseGrappleAction(g, who));

    actions.push(new ShoveAction(g, who));

    if (who.inventory.size && who.freeHands)
      actions.push(new DonAction(g, who));
    if (who.equipment.size) actions.push(new DoffAction(g, who));
  });
});

export const DeafenedRule = new DndRule("Deafened", (g) => {
  g.events.on("BeforeCheck", ({ detail: { tags, who, successResponse } }) => {
    if (tags.has("hearing") && who.conditions.has("Deafened"))
      successResponse.add("fail", DeafenedRule);
  });

  g.events.on("CheckHearing", ({ detail: { who, error } }) => {
    if (who.conditions.has("Deafened")) error.add("deaf", DeafenedRule);
  });
});

export const DifficultTerrainRule: Source = { name: "Difficult Terrain" };

export const EffectsRule = new DndRule("Effects", (g) => {
  g.events.on("TurnStarted", ({ detail: { who } }) =>
    who.tickEffects("turnStart"),
  );

  g.events.on("TurnEnded", ({ detail: { who } }) => who.tickEffects("turnEnd"));
});

export const ExhaustionRule = new DndRule("Exhaustion", (g) => {
  // Level 1: Disadvantage on ability checks
  g.events.on("BeforeCheck", ({ detail: { who, diceType } }) => {
    if (who.exhaustion >= 1) diceType.add("disadvantage", ExhaustionRule);
  });

  // Level 2: Speed halved
  // Level 5: Speed reduced to 0
  g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
    if (who.exhaustion >= 2) multiplier.add("half", ExhaustionRule);
    if (who.exhaustion >= 5) multiplier.add("zero", ExhaustionRule);
  });

  // Level 3: Disadvantage on attack rolls and saving throws
  g.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
    if (who.exhaustion >= 3) diceType.add("disadvantage", ExhaustionRule);
  });
  g.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
    if (who.exhaustion >= 3) diceType.add("disadvantage", ExhaustionRule);
  });

  // Level 4: Hit point maximum halved
  g.events.on("GetMaxHP", ({ detail: { who, multiplier } }) => {
    if (who.exhaustion >= 4) multiplier.add("half", ExhaustionRule);
  });

  // Level 6: Death
  g.events.on("Exhaustion", ({ detail: { who, interrupt } }) => {
    if (who.exhaustion >= 6)
      interrupt.add(
        new EvaluateLater(who, ExhaustionRule, Priority.Late, () =>
          g.kill(who),
        ),
      );
  });
});

export const FrightenedRule = new DndRule("Frightened", (g) => {
  // A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.
  const checkFrightened: Listener<"BeforeAttack" | "BeforeCheck"> = ({
    detail: { who, diceType },
  }) => {
    for (const other of who.frightenedBy)
      if (g.canSee(who, other)) {
        diceType.add("disadvantage", FrightenedRule);
        return;
      }
  };
  g.events.on("BeforeCheck", checkFrightened);
  g.events.on("BeforeAttack", checkFrightened);

  // The creature can't willingly move closer to the source of its fear.
  g.events.on("BeforeMove", ({ detail: { who, from, to, error } }) => {
    for (const other of who.frightenedBy) {
      const { oldDistance, newDistance } = compareDistances(
        other,
        other.position,
        who,
        from,
        to,
      );

      if (newDistance < oldDistance)
        error.add(`cannot move closer to ${other.name}`, FrightenedRule);
    }
  });
});

export const HeavyArmorRule = new DndRule("Heavy Armor", (g) => {
  // Heavier armor interferes with the wearer's ability to move quickly, stealthily, and freely. If the Armor table shows "Str 13" or "Str 15" in the Strength column for an armor type, the armor reduces the wearer's speed by 10 feet unless the wearer has a Strength score equal to or higher than the listed score.
  g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
    const minimum = who.armor?.minimumStrength ?? 1;
    if (who.str.score < minimum) bonus.add(-10, HeavyArmorRule);
  });

  // If the Armor table shows "Disadvantage" in the Stealth column, the wearer has disadvantage on Dexterity (Stealth) checks.
  g.events.on(
    "BeforeCheck",
    ({ detail: { ability, skill, who, diceType } }) => {
      if (
        ability === "dex" &&
        skill === "Stealth" &&
        who.armor?.stealthDisadvantage
      )
        diceType.add("disadvantage", HeavyArmorRule);
    },
  );
});

export const IncapacitatedRule = new DndRule("Incapacitated", (g) => {
  // An incapacitated creature can't take actions or reactions.
  g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
    if (
      action.actor.conditions.has("Incapacitated") &&
      (action.tags.has("costs attack") || action.getTime(config))
    )
      error.add("incapacitated", IncapacitatedRule);
  });
});

/* TODO Invisible
- An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured. The creature's location can be detected by any noise it makes or any tracks it leaves.
- Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage.
*/

export const LongRangeAttacksRule = new DndRule("Long Range Attacks", (g) => {
  g.events.on(
    "BeforeAttack",
    ({ detail: { who, target, weapon, diceType } }) => {
      if (
        isDefined(weapon?.shortRange) &&
        distance(who, target) > weapon.shortRange
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
    const squares = getSquares(target, target.position);
    if (isHeavilyObscuredAnywhere(squares))
      diceType.add("disadvantage", ObscuredRule);
  });

  g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
    const squares = getSquares(who, who.position);
    if (isHeavilyObscuredAnywhere(squares))
      conditions.add("Blinded", ObscuredRule);
  });
});

export const OneAttackPerTurnRule = new DndRule("Attacks per turn", (g) => {
  g.events.on("CheckAction", ({ detail: { action, error } }) => {
    if (action.tags.has("costs attack") && action.actor.attacksSoFar.length)
      error.add("No attacks left", OneAttackPerTurnRule);
  });
});

export const OneSpellPerTurnRule = new DndRule("Spells per turn", (g) => {
  g.events.on("CheckAction", ({ detail: { action, error } }) => {
    if (
      !action.actor.spellsSoFar.length ||
      !isCastSpell(action) ||
      action.spell.time === "reaction"
    )
      return;

    const considering = action.actor.spellsSoFar.concat(action.spell);

    // A spell cast with a bonus action is especially swift. You must use a bonus action on your turn to cast the spell, provided that you haven't already taken a bonus action this turn. You can't cast another spell during the same turn, except for a cantrip with a casting time of 1 action.
    const bonusActionSpell = considering.find(
      (sp) => sp.time === "bonus action",
    );
    const cantripActionSpell = considering.find(
      (sp) => sp.level === 0 && sp.time === "action",
    );

    if (!bonusActionSpell || !cantripActionSpell)
      error.add(
        "can only cast a bonus action spell and an action cantrip in the same turn",
        OneSpellPerTurnRule,
      );
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
      const range = getWeaponRange(attacker, weapon, "melee");
      return oldDistance <= range && newDistance > range;
    })
    .map((weapon) => new OpportunityAttack(g, attacker, weapon))
    .filter((opportunity) => checkConfig(g, opportunity, { target }));
}

export const OpportunityAttacksRule = new DndRule(
  "Opportunity Attacks",
  (g) => {
    g.events.on(
      "BeforeMove",
      ({
        detail: {
          handler,
          who,
          from,
          to,
          interrupt,
          simulation,
          success,
          error,
        },
      }) => {
        if (!handler.provokesOpportunityAttacks || simulation) return;

        for (const attacker of g.combatants) {
          if (attacker.side === who.side) continue;

          const validActions = getValidOpportunityAttacks(
            g,
            attacker,
            attacker.position,
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
                Priority.Late,
                validActions.map((value) => ({
                  label: value.weapon.name,
                  value,
                })),
                async (opportunity) => {
                  await g.act(opportunity, { target: who });
                },
                true,
                () => success.result !== "fail" && error.result,
              ),
            );
        }
      },
    );
  },
);

const autoFail =
  (
    condition: ConditionName,
    rule: DndRule,
    abilities: AbilityName[],
  ): Listener<"BeforeSave"> =>
  ({ detail: { ability, who, successResponse } }) => {
    if (who.conditions.has(condition) && ability && abilities.includes(ability))
      successResponse.add("fail", rule);
  };
const autoCrit =
  (
    g: Engine,
    condition: ConditionName,
    rule: DndRule,
    maxRange = 5,
  ): Listener<"Attack"> =>
  ({
    detail: {
      roll: {
        type: { who, target },
      },
      outcome,
    },
  }) => {
    if (target.conditions.has(condition) && distance(who, target) <= maxRange)
      outcome.add("critical", rule);
  };

export const ParalyzedRule = new DndRule("Paralyzed", (g) => {
  // ...and can't move
  g.events.on("BeforeMove", ({ detail: { who, error } }) => {
    if (who.conditions.has("Paralyzed")) error.add("paralyzed", ParalyzedRule);
  });
  // ...or speak.
  g.events.on("CheckAction", ({ detail: { action, error } }) => {
    if (action.actor.conditions.has("Paralyzed") && action.tags.has("vocal"))
      error.add("paralyzed", ParalyzedRule);
  });

  // The creature automatically fails Strength and Dexterity saving throws.
  g.events.on(
    "BeforeSave",
    autoFail("Paralyzed", ParalyzedRule, ["str", "dex"]),
  );

  // Attack rolls against the creature have advantage.
  g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
    if (target.conditions.has("Paralyzed"))
      diceType.add("advantage", ParalyzedRule);
  });

  // Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.
  g.events.on("Attack", autoCrit(g, "Paralyzed", ParalyzedRule));
});

/* TODO Petrified
- A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.
- The creature is incapacitated, can't move or speak, and is unaware of its surroundings.
- Attack rolls against the creature have advantage.
- The creature automatically fails Strength and Dexterity saving throws.
- The creature has resistance to all damage.
- The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.
*/

export const PoisonedRule = new DndRule("Poisoned", (g) => {
  // A poisoned creature has disadvantage on attack rolls and ability checks.
  const poisonCheck: Listener<"BeforeAttack" | "BeforeCheck"> = ({
    detail: { who, diceType },
  }) => {
    if (who.conditions.has("Poisoned"))
      diceType.add("disadvantage", PoisonedRule);
  };

  g.events.on("BeforeAttack", poisonCheck);
  g.events.on("BeforeCheck", poisonCheck);
});

export const ProficiencyRule = new DndRule("Proficiency", (g) => {
  g.events.on(
    "BeforeAttack",
    ({ detail: { who, proficiency, spell, weapon } }) => {
      proficiency.add(
        weapon ? who.getProficiency(weapon) : spell ? "proficient" : "none",
        ProficiencyRule,
      );
    },
  );
  g.events.on(
    "BeforeCheck",
    ({ detail: { who, skill, tool, proficiency } }) => {
      if (skill) proficiency.add(who.getProficiency(skill), ProficiencyRule);
      if (tool) proficiency.add(who.getProficiency(tool), ProficiencyRule);
    },
  );
  g.events.on("BeforeSave", ({ detail: { who, ability, proficiency } }) => {
    if (ability) proficiency.add(who.getProficiency(ability), ProficiencyRule);
  });
  g.events.on("GetSaveDC", ({ detail: { type, bonus, who } }) => {
    if (type.type === "ability" && who) bonus.add(who.pb, ProficiencyRule);
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
  // A restrained creature's speed becomes 0...
  g.events.on("GetSpeed", ({ detail: { who, multiplier, bonus } }) => {
    if (who.conditions.has("Restrained")) {
      multiplier.add("zero", RestrainedRule);
      bonus.ignoreAll();
    }
  });

  g.events.on("BeforeAttack", ({ detail: { who, diceType, target } }) => {
    // Attack rolls against the creature have advantage...
    if (target.conditions.has("Restrained"))
      diceType.add("advantage", RestrainedRule);
    // ...and the creature's attack rolls have disadvantage.
    if (who.conditions.has("Restrained"))
      diceType.add("disadvantage", RestrainedRule);
  });

  // The creature has disadvantage on Dexterity saving throws.
  g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
    if (who.conditions.has("Restrained") && ability === "dex")
      diceType.add("disadvantage", RestrainedRule);
  });
});

export const SpeedRule = new DndRule("Speed", (g) => {
  g.events.on("BeforeMove", ({ detail: { handler, cost, who, error } }) => {
    if (handler.turnMovement && cost + who.movedSoFar > who.speed)
      error.add("cannot exceed speed", SpeedRule);
  });
});

export const StunnedRule = new DndRule("Stunned", (g) => {
  // ...can't move...
  g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
    if (who.conditions.has("Stunned")) multiplier.add("zero", StunnedRule);
  });

  // TODO ...and can speak only falteringly.

  // The creature automatically fails Strength and Dexterity saving throws.
  g.events.on("BeforeSave", autoFail("Stunned", StunnedRule, ["str", "dex"]));

  // Attack rolls against the creature have advantage.
  g.events.on("BeforeAttack", ({ detail: { diceType, target } }) => {
    if (target.conditions.has("Stunned"))
      diceType.add("advantage", StunnedRule);
  });
});

export const TurnTimeRule = new DndRule("Turn Time", (g) => {
  g.events.on("TurnStarted", ({ detail: { who } }) => who.resetTime());
});

export const TwoWeaponFightingRule = new DndRule("Two-Weapon Fighting", (g) => {
  g.events.on("GetActions", ({ detail: { who, actions } }) => {
    /* When you take the Attack action and attack with a light melee weapon that you're holding in one hand, you can use a bonus action to attack with a different light melee weapon that you're holding in the other hand. You don't add your ability modifier to the damage of the bonus attack, unless that modifier is negative.

    If either weapon has the thrown property, you can throw the weapon, instead of making a melee attack with it. */

    const lightMeleeAttack = who.attacksSoFar.find(
      (atk): atk is WeaponAttack =>
        atk instanceof WeaponAttack &&
        atk.weapon.properties.has("light") &&
        atk.weapon.rangeCategory === "melee",
    );
    const otherLightWeapon =
      lightMeleeAttack &&
      who.weapons.find(
        (w) => w.properties.has("light") && w !== lightMeleeAttack.weapon,
      );
    if (otherLightWeapon) {
      actions.push(new TwoWeaponAttack(g, who, "melee", otherLightWeapon));
      if (otherLightWeapon.properties.has("thrown"))
        actions.push(new TwoWeaponAttack(g, who, "ranged", otherLightWeapon));
    }
  });
});

export const UnconsciousRule = new DndRule("Unconscious", (g) => {
  // The creature automatically fails Strength and Dexterity saving throws.
  g.events.on(
    "BeforeSave",
    autoFail("Unconscious", UnconsciousRule, ["str", "dex"]),
  );

  // Attack rolls against the creature have advantage.
  g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
    if (target.conditions.has("Unconscious"))
      diceType.add("advantage", UnconsciousRule);
  });

  // Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.
  g.events.on("Attack", autoCrit(g, "Unconscious", UnconsciousRule));
});

export const WeaponAttackRule = new DndRule("Weapon Attacks", (g) => {
  g.events.on("GetActions", ({ detail: { who, target, actions } }) => {
    if (who !== target) {
      for (const weapon of who.weapons) {
        if (weapon.rangeCategory === "melee") {
          actions.push(meleeWeaponAttack(g, who, weapon));
        } else {
          for (const ammo of getValidAmmunition(who, weapon))
            actions.push(rangedWeaponAttack(g, who, weapon, ammo));
        }

        if (weapon.properties.has("thrown"))
          actions.push(thrownWeaponAttack(g, who, weapon));
      }
    }
  });
});

export default class DndRules {
  constructor(public g: Engine) {
    for (const rule of RuleRepository) rule.setup(g);
  }
}
