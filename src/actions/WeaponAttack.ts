import { getItemIcon } from "../colours";
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
import AbstractAttackAction from "./AbstractAttackAction";

export default class WeaponAttack extends AbstractAttackAction<HasTarget> {
  ability: AbilityName;

  constructor(
    g: Engine,
    actor: Combatant,
    public weapon: WeaponItem,
    public ammo?: AmmoItem,
  ) {
    super(
      g,
      actor,
      ammo ? `${weapon.name} (${ammo.name})` : weapon.name,
      weapon.properties.has("thrown") ? "incomplete" : "implemented",
      { target: new TargetResolver(g, getWeaponRange(actor, weapon)) },
    );
    this.ability = getWeaponAbility(actor, weapon);
    this.icon = getItemIcon(weapon);
    this.subIcon = getItemIcon(ammo);
  }

  getDamage() {
    return [this.weapon.damage];
  }

  async apply({ target }: HasTarget) {
    super.apply({ target });
    const { ability, ammo, weapon, actor: attacker, g } = this;

    const tags = new Set<AttackTag>();
    tags.add(
      distance(g, attacker, target) > attacker.reach ? "ranged" : "melee",
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
      // TODO [SPAWNITEMS] throwing

      if (ammo) ammo.quantity--;

      const { damage } = weapon;
      const baseDamage: DamageInitialiser = [];

      if (damage.type === "dice") {
        const { count, size } = damage.amount;
        const amount = await g.rollDamage(
          count,
          {
            source: this,
            size,
            damageType: damage.damageType,
            attacker,
            target,
            ability,
            weapon,
          },
          critical,
        );
        baseDamage.push([damage.damageType, amount]);
      } else baseDamage.push([damage.damageType, damage.amount]);

      await g.damage(
        weapon,
        weapon.damage.damageType,
        { attack, attacker, target, ability, weapon, ammo, critical },
        baseDamage,
      );
    }
  }
}
