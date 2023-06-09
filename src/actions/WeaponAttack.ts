import ErrorCollector from "../collectors/ErrorCollector";
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
      "incomplete",
      { target: new TargetResolver(g, getWeaponRange(actor, weapon)) }
    );
    this.ability = getWeaponAbility(actor, weapon);

    this.attack = true;
    this.icon = getItemIcon(weapon);
    this.subIcon = getItemIcon(ammo);
  }

  check(config: Partial<HasTarget>, ec: ErrorCollector): ErrorCollector {
    return super.check(config, ec);
  }

  getDamage() {
    return [this.weapon.damage];
  }

  async apply({ target }: HasTarget) {
    const { ability, ammo, weapon, actor: attacker, g } = this;
    attacker.attacksSoFar.add(this);

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
      // TODO [SPAWNITEMS] throwing

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
