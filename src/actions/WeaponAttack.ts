import DamageMap from "../DamageMap";
import Engine from "../Engine";
import TargetResolver from "../resolvers/TargetResolver";
import Ability from "../types/Ability";
import Action, { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import { getWeaponAbility, getWeaponRange } from "../utils/items";

type HasTarget = { target: Combatant };

export default class WeaponAttack implements Action<HasTarget> {
  ability: Ability;
  config: ActionConfig<HasTarget>;
  name: string;

  constructor(public who: Combatant, public weapon: WeaponItem) {
    const range = getWeaponRange(who, weapon);
    this.ability = getWeaponAbility(who, weapon);

    this.config = { target: new TargetResolver(range) };
    this.name = weapon.name;
  }

  async apply(g: Engine, { target }: HasTarget) {
    const { ability, weapon, who } = this;
    const attack = await g.roll({
      type: "attack",
      who,
      target,
      weapon,
      ability,
    });
    const proficiencyBonus = weapon
      ? who.getProficiencyMultiplier(weapon) * who.pb
      : 0;

    const abilityBonus = who[ability];

    // TODO ammunition, throwing

    const total = attack.value + proficiencyBonus + abilityBonus;
    if (total >= target.ac) {
      const map = new DamageMap();
      const { damage } = weapon;

      if (damage.type === "dice") {
        const { count, size } = damage.amount;

        const amount = await g.rollDamage(count, {
          size,
          damageType: damage.damageType,
          attacker: who,
          target,
          ability,
          weapon,
        });
        map.add(damage.damageType, amount + abilityBonus);
      } else map.add(damage.damageType, damage.amount + abilityBonus);

      await g.damage(map, { source: this, attacker: who, target });
    }
  }
}
