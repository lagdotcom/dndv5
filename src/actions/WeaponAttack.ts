import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import { DamageInitialiser } from "../DamageMap";
import Engine from "../Engine";
import TargetResolver from "../resolvers/TargetResolver";
import Ability from "../types/Ability";
import Action, { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import { getWeaponAbility, getWeaponRange } from "../utils/items";
import { distance } from "../utils/units";

export default class WeaponAttack implements Action<HasTarget> {
  ability: Ability;
  config: ActionConfig<HasTarget>;
  name: string;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public weapon: WeaponItem,
    public ammo?: AmmoItem
  ) {
    const range = getWeaponRange(actor, weapon);
    this.ability = getWeaponAbility(actor, weapon);

    this.config = { target: new TargetResolver(g, range) };
    this.name = ammo ? `${weapon.name} (${ammo.name})` : weapon.name;
  }

  getAffectedArea() {
    // TODO exploding ammo???
    return undefined;
  }

  getConfig() {
    return this.config;
  }

  getDamage() {
    return [this.weapon.damage];
  }

  check(config: Partial<HasTarget>, ec = new ErrorCollector()): ErrorCollector {
    // TODO check action economy

    return ec;
  }

  async apply({ target }: HasTarget) {
    const { ability, ammo, weapon, actor: attacker, g } = this;

    // TODO spend action/attack

    const type =
      distance(g, attacker, target) > attacker.reach ? "ranged" : "melee";

    const { attack, critical, hit } = await g.attack({
      who: attacker,
      type,
      target,
      ability,
      weapon,
      ammo,
    });

    if (hit) {
      // TODO throwing

      if (ammo) ammo.quantity--;

      const { damage } = weapon;
      const baseDamage: DamageInitialiser = [];

      if (damage.type === "dice") {
        const { count, size } = damage.amount;
        const amount = await g.rollDamage(
          count,
          {
            size,
            damageType: damage.damageType,
            attacker,
            target,
            ability,
            weapon,
          },
          critical
        );
        baseDamage.push([damage.damageType, amount]);
      } else baseDamage.push([damage.damageType, damage.amount]);

      await g.damage(
        weapon,
        weapon.damage.damageType,
        { attack, attacker, target, ability, weapon, ammo, critical },
        baseDamage
      );
    }
  }
}
