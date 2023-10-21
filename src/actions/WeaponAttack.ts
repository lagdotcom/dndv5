import { HasTarget } from "../configs";
import { DamageInitialiser } from "../DamageMap";
import Engine from "../Engine";
import { notSelf } from "../filters";
import TargetResolver from "../resolvers/TargetResolver";
import AbilityName from "../types/AbilityName";
import AttackTag from "../types/AttackTag";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import Source from "../types/Source";
import { poSet, poWithin } from "../utils/ai";
import { getWeaponAbility, getWeaponRange } from "../utils/items";
import { describeDice } from "../utils/text";
import { isDefined } from "../utils/types";
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
      {
        target: new TargetResolver(g, getWeaponRange(actor, weapon), [notSelf]),
      },
    );
    this.ability = getWeaponAbility(actor, weapon);
    this.icon = weapon.icon;
    this.subIcon = ammo?.icon;
  }

  generateAttackConfigs(targets: Combatant[]) {
    const ranges = [this.weapon.shortRange, this.weapon.longRange].filter(
      isDefined,
    );

    return targets.flatMap((target) =>
      ranges.map((range) => ({
        config: { target },
        positioning: poSet(poWithin(range, target)),
      })),
    );
  }

  getDamage() {
    return [this.weapon.damage];
  }

  getDescription() {
    const { actor, weapon } = this;

    const rangeCategories: string[] = [];
    const ranges: string[] = [];

    if (weapon.rangeCategory === "melee") {
      rangeCategories.push("Melee");
      ranges.push(`reach ${actor.reach + weapon.reach} ft.`);
    }
    if (weapon.rangeCategory === "ranged" || weapon.properties.has("thrown")) {
      rangeCategories.push("Ranged");
      ranges.push(`range ${weapon.shortRange}/${weapon.longRange} ft.`);
    }

    // TODO
    const bonus = "+?";
    const { average, list } = describeDice([weapon.damage]);
    const damageType = weapon.damage.damageType;

    return `${rangeCategories.join(
      " or ",
    )} Weapon Attack: ${bonus} to hit, ${ranges.join(
      " or ",
    )}, one target. Hit: ${Math.ceil(average)} (${list}) ${damageType} damage.`;
  }

  getTargets(config: HasTarget): Combatant[] {
    return [config.target];
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
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
    return { type: "hit", attack: e, damage: e2 } as const;
  }

  return { type: "miss", attack: e } as const;
}
