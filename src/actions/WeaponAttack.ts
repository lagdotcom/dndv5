import { HasTarget } from "../configs";
import { DamageInitialiser } from "../DamageMap";
import Engine, { EngineAttackResult } from "../Engine";
import { notSelf } from "../filters";
import TargetResolver from "../resolvers/TargetResolver";
import AbilityName from "../types/AbilityName";
import AttackTag from "../types/AttackTag";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import Source from "../types/Source";
import { poSet, poWithin } from "../utils/ai";
import { sieve } from "../utils/array";
import { getWeaponAbility, getWeaponRange } from "../utils/items";
import { SetInitialiser } from "../utils/set";
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
    public tags?: SetInitialiser<AttackTag>,
  ) {
    super(
      g,
      actor,
      ammo
        ? `Attack (${weapon.name}, ${ammo.name})`
        : `Attack (${weapon.name})`,
      weapon.properties.has("thrown") ? "incomplete" : "implemented",
      {
        target: new TargetResolver(g, getWeaponRange(actor, weapon), [notSelf]),
      },
      { icon: weapon.icon, subIcon: ammo?.icon },
    );
    this.ability = getWeaponAbility(actor, weapon);
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

  getTargets({ target }: Partial<HasTarget>) {
    return sieve(target);
  }

  getAffected({ target }: HasTarget) {
    return [target];
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
      tags: this.tags,
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
    tags: startTags,
  }: {
    ability: AbilityName;
    ammo?: AmmoItem;
    attacker: Combatant;
    source: Source;
    target: Combatant;
    weapon: WeaponItem;
    tags?: SetInitialiser<AttackTag>;
  },
) {
  const tags = new Set<AttackTag>(startTags);
  // TODO this should probably be a choice
  tags.add(
    distance(attacker, target) > attacker.reach + weapon.reach
      ? "ranged"
      : "melee",
  );

  if (weapon.category !== "natural") tags.add("weapon");
  if (weapon.magical || ammo?.magical) tags.add("magical");

  return getAttackResult(
    g,
    source,
    await g.attack({ who: attacker, tags, target, ability, weapon, ammo }),
  );
}

async function getAttackResult(
  g: Engine,
  source: Source,
  e: Awaited<EngineAttackResult>,
) {
  if (e.hit) {
    // TODO [SPAWNITEMS] throwing

    const { who: attacker, target, ability, weapon, ammo } = e.attack.pre;
    if (ammo) ammo.quantity--;

    if (weapon) {
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

    return { type: "hit", attack: e } as const;
  }

  return { type: "miss", attack: e } as const;
}
