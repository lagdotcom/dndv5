import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import { DamageInitialiser } from "../DamageMap";
import Engine from "../Engine";
import TargetResolver from "../resolvers/TargetResolver";
import AbilityName from "../types/AbilityName";
import AttackTag from "../types/AttackTag";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import { getWeaponAbility, getWeaponRange } from "../utils/items";
import { distance } from "../utils/units";
import AbstractAction from "./AbstractAction";

export default class WeaponAttack extends AbstractAction<HasTarget> {
  ability: AbilityName;

  constructor(
    g: Engine,
    actor: Combatant,
    public weapon: WeaponItem,
    public ammo?: AmmoItem
  ) {
    super(
      g,
      actor,
      ammo ? `${weapon.name} (${ammo.name})` : weapon.name,
      { target: new TargetResolver(g, getWeaponRange(actor, weapon)) },
      undefined,
      undefined,
      [weapon.damage]
    );
    this.ability = getWeaponAbility(actor, weapon);
  }

  check(config: Partial<HasTarget>, ec: ErrorCollector): ErrorCollector {
    // TODO check action economy

    return super.check(config, ec);
  }

  async apply({ target }: HasTarget) {
    const { ability, ammo, weapon, actor: attacker, g } = this;

    // TODO spend action/attack

    const tags = new Set<AttackTag>();
    tags.add(
      distance(g, attacker, target) > attacker.reach ? "ranged" : "melee"
    );
    if (weapon.category !== "natural") tags.add("weapon");
    if (weapon.magical || ammo?.magical) tags.add("magical");

    const { attack, critical, hit } = await g.attack({
      who: attacker,
      tags,
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
