import { getItemIcon } from "../colours";
import { HasTarget } from "../configs";
import { DamageInitialiser } from "../DamageMap";
import Engine from "../Engine";
import TargetResolver from "../resolvers/TargetResolver";
import AbilityName from "../types/AbilityName";
import AttackTag from "../types/AttackTag";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import Source from "../types/Source";
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

    await doStandardAttack(this.g, {
      ability: this.ability,
      ammo: this.ammo,
      attacker: this.actor,
      source: this,
      target,
      weapon: this.weapon,
    });
  }
}

export async function doStandardAttack(
  g: Engine,
  {
    ability,
    ammo,
    attacker,
    source,
    target,
    weapon,
  }: {
    ability: AbilityName;
    ammo?: AmmoItem;
    attacker: Combatant;
    source: Source;
    target: Combatant;
    weapon: WeaponItem;
  },
) {
  const tags = new Set<AttackTag>();
  // TODO this should probably be a choice
  tags.add(
    distance(g, attacker, target) > attacker.reach + weapon.reach
      ? "ranged"
      : "melee",
  );

  if (weapon.category !== "natural") tags.add("weapon");
  if (weapon.magical || ammo?.magical) tags.add("magical");

  const e = await g.attack({
    who: attacker,
    tags,
    target,
    ability,
    weapon,
    ammo,
  });

  if (e.hit) {
    // TODO [SPAWNITEMS] throwing

    if (ammo) ammo.quantity--;

    const { damage } = weapon;
    const baseDamage: DamageInitialiser = [];

    if (damage.type === "dice") {
      const { count, size } = damage.amount;
      const amount = await g.rollDamage(
        count,
        {
          source,
          size,
          damageType: damage.damageType,
          attacker,
          target,
          ability,
          weapon,
        },
        e.critical,
      );
      baseDamage.push([damage.damageType, amount]);
    } else baseDamage.push([damage.damageType, damage.amount]);

    const e2 = await g.damage(
      weapon,
      weapon.damage.damageType,
      {
        attack: e.attack,
        attacker,
        target,
        ability,
        weapon,
        ammo,
        critical: e.critical,
      },
      baseDamage,
    );
    return { type: "hit", attack: e, damage: e2 };
  }

  return { type: "miss", attack: e };
}
