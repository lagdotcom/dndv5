import DashAction from "./actions/DashAction";
import DisengageAction from "./actions/DisengageAction";
import DodgeAction from "./actions/DodgeAction";
import WeaponAttack from "./actions/WeaponAttack";
import DndRule, { RuleRepository } from "./DndRule";
import Engine from "./Engine";
import PointSet from "./PointSet";
import { ResourceRegistry } from "./resources";
import Item from "./types/Item";
import { resolveArea } from "./utils/areas";
import { getValidAmmunition } from "./utils/items";
import { distance, getSquares } from "./utils/units";

export const AbilityScoreRule = new DndRule("Ability Score", (g) => {
  g.events.on("beforeAttack", ({ detail: { who, ability, bonus } }) => {
    bonus.add(who[ability], AbilityScoreRule);
  });

  g.events.on("gatherDamage", ({ detail: { attacker, ability, bonus } }) => {
    if (ability) bonus.add(attacker[ability], AbilityScoreRule);
  });

  g.events.on("getInitiative", ({ detail: { who, bonus } }) => {
    bonus.add(who.dex, AbilityScoreRule);
  });
});

export const ArmorCalculationRule = new DndRule("Armor Calculation", (g) => {
  g.events.on("getACMethods", ({ detail: { who, methods } }) => {
    const { armor, dex, shield } = who;
    const armorAC = armor?.ac ?? 10;
    const shieldAC = shield?.ac ?? 0;

    const uses = new Set<Item>();
    if (armor) uses.add(armor);
    if (shield) uses.add(shield);

    const name = armor ? `${armor.category} armor` : "unarmored";
    const dexMod =
      armor?.category === "medium"
        ? Math.min(dex, 2)
        : armor?.category === "heavy"
        ? 0
        : dex;
    methods.push({ name, ac: armorAC + dexMod + shieldAC, uses });
  });
});

export const BlindedRule = new DndRule("Blinded", (g) => {
  g.events.on("beforeAttack", ({ detail: { who, diceType, target } }) => {
    if (who.conditions.has("Blinded"))
      diceType.add("disadvantage", BlindedRule);
    if (target.conditions.has("Blinded"))
      diceType.add("advantage", BlindedRule);
  });
});

export const CombatActionsRule = new DndRule("Combat Actions", (g) => {
  g.events.on("getActions", ({ detail: { who, actions } }) => {
    actions.push(new DashAction(g, who));
    actions.push(new DisengageAction(g, who));
    actions.push(new DodgeAction(g, who));
  });
});

export const EffectsRule = new DndRule("Effects", (g) => {
  g.events.on("turnStarted", ({ detail: { who } }) =>
    who.tickEffects("turnStart")
  );

  g.events.on("turnEnded", ({ detail: { who } }) => who.tickEffects("turnEnd"));
});

export const LongRangeAttacksRule = new DndRule("Long Range Attacks", (g) => {
  g.events.on(
    "beforeAttack",
    ({ detail: { who, target, weapon, diceType } }) => {
      if (
        typeof weapon?.shortRange === "number" &&
        distance(g, who, target) > weapon.shortRange
      )
        diceType.add("disadvantage", LongRangeAttacksRule);
    }
  );
});

export const ObscuredRule = new DndRule("Obscured", (g) => {
  const isHeavilyObscuredAnywhere = (squares: PointSet) => {
    for (const effect of g.effects) {
      if (!effect.tags.has("heavily obscured")) continue;

      const area = new PointSet(resolveArea(effect.shape));
      for (const square of squares) {
        if (area.has(square)) return true;
      }
    }

    return false;
  };

  // TODO should really check anywhere along the path...
  g.events.on("beforeAttack", ({ detail: { diceType, target } }) => {
    const squares = new PointSet(
      getSquares(target, g.getState(target).position)
    );
    if (isHeavilyObscuredAnywhere(squares))
      diceType.add("disadvantage", ObscuredRule);
  });

  g.events.on("getConditions", ({ detail: { conditions, who } }) => {
    const squares = new PointSet(getSquares(who, g.getState(who).position));
    if (isHeavilyObscuredAnywhere(squares)) conditions.add("Blinded");
  });
});

export const ProficiencyRule = new DndRule("Proficiency", (g) => {
  g.events.on("beforeAttack", ({ detail: { who, bonus, spell, weapon } }) => {
    const mul = weapon ? who.getProficiencyMultiplier(weapon) : spell ? 1 : 0;
    bonus.add(who.pb * mul, ProficiencyRule);
  });

  g.events.on("beforeSave", ({ detail: { who, ability, bonus } }) => {
    const mul = who.getProficiencyMultiplier(ability);
    bonus.add(who.pb * mul, ProficiencyRule);
  });
});

export const ResourcesRule = new DndRule("Resources", (g) => {
  g.events.on("turnStarted", ({ detail: { who } }) => {
    for (const name of who.resources.keys()) {
      const resource = ResourceRegistry.get(name);
      if (resource?.refresh === "turnStart") who.refreshResource(resource);
    }
  });
});

export const TurnTimeRule = new DndRule("Turn Time", (g) => {
  g.events.on("turnStarted", ({ detail: { who } }) => {
    who.time.add("action");
    who.time.add("bonus action");
    who.time.add("reaction");
  });
});

export const WeaponAttackRule = new DndRule("Weapon Attacks", (g) => {
  g.events.on("getActions", ({ detail: { who, target, actions } }) => {
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
