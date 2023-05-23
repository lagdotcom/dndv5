import WeaponAttack from "./actions/WeaponAttack";
import Engine from "./Engine";
import Item from "./types/Item";
import { getValidAmmunition } from "./utils/items";
import { distance } from "./utils/units";

class DndRule {
  constructor(
    public name: string,
    public setup: (g: Engine, me: DndRule) => void
  ) {}
}

export const AbilityScoreRule = new DndRule("Ability Score", (g, me) => {
  g.events.on("beforeAttack", ({ detail: { attacker, ability, bonus } }) => {
    bonus.add(attacker[ability], me);
  });

  g.events.on("gatherDamage", ({ detail: { attacker, ability, bonus } }) => {
    bonus.add(attacker[ability], me);
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

export const LongRangeAttacksRule = new DndRule(
  "Long Range Attacks",
  (g, me) => {
    g.events.on(
      "beforeAttack",
      ({ detail: { attacker, target, weapon, diceType } }) => {
        if (
          typeof weapon?.shortRange === "number" &&
          distance(g, attacker, target) > weapon.shortRange
        )
          diceType.add("disadvantage", me);
      }
    );
  }
);

export const ProficiencyRule = new DndRule("Proficiency", (g, me) => {
  g.events.on("beforeAttack", ({ detail: { attacker, weapon, bonus } }) => {
    if (weapon && attacker.getProficiencyMultiplier(weapon))
      bonus.add(attacker.pb, me);
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

export const allDndRules = [
  AbilityScoreRule,
  ArmorCalculationRule,
  LongRangeAttacksRule,
  ProficiencyRule,
  TurnTimeRule,
  WeaponAttackRule,
];

export default class DndRules {
  constructor(public g: Engine) {
    for (const rule of allDndRules) rule.setup(g, rule);
  }
}
