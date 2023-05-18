import WeaponAttack from "./actions/WeaponAttack";
import Engine from "./Engine";

export class CombatantAttackRule {
  constructor(public g: Engine) {
    g.events.on("getActions", ({ detail: { who, target, actions } }) => {
      if (who !== target) {
        for (const weapon of who.naturalWeapons)
          actions.push(new WeaponAttack(who, weapon));

        for (const item of who.equipment) {
          if (item.itemType === "weapon")
            actions.push(new WeaponAttack(who, item));
        }
      }
    });
  }
}

export default class DndRules {
  constructor(public g: Engine) {
    new CombatantAttackRule(g);
  }
}
