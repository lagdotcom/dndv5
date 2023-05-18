import WeaponAttack from "./actions/WeaponAttack";
import Engine from "./Engine";
import Item from "./types/Item";

export class CombatantArmourCalculation {
  constructor(public g: Engine) {
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
  }
}

export class CombatantWeaponAttacks {
  constructor(public g: Engine) {
    g.events.on("getActions", ({ detail: { who, target, actions } }) => {
      if (who !== target) {
        for (const weapon of who.weapons)
          actions.push(new WeaponAttack(who, weapon));
      }
    });
  }
}

export default class DndRules {
  constructor(public g: Engine) {
    new CombatantArmourCalculation(g);
    new CombatantWeaponAttacks(g);
  }
}
