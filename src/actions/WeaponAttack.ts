import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import { DamageInitialiser } from "../DamageMap";
import Engine, { EngineAttackResult } from "../Engine";
import { notSelf } from "../filters";
import YesNoChoice from "../interruptions/YesNoChoice";
import TargetResolver from "../resolvers/TargetResolver";
import AbilityName from "../types/AbilityName";
import AttackTag from "../types/AttackTag";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import Priority from "../types/Priority";
import RangeCategory from "../types/RangeCategory";
import Source from "../types/Source";
import { poSet, poWithin } from "../utils/ai";
import { sieve } from "../utils/array";
import { getWeaponAbility, getWeaponRange } from "../utils/items";
import { SetInitialiser } from "../utils/set";
import { describeDice } from "../utils/text";
import { isDefined } from "../utils/types";
import AbstractAttackAction from "./AbstractAttackAction";

export function getWeaponAttackName(
  name: string,
  rangeCategory: RangeCategory,
  weapon: WeaponItem,
  ammo?: AmmoItem,
) {
  const ammoName = ammo
    ? ammo.name
    : weapon.properties.has("thrown") && rangeCategory === "ranged"
      ? "thrown"
      : undefined;

  if (ammoName) return `${name} (${weapon.name}, ${ammoName})`;
  return `${name} (${weapon.name})`;
}

export default class WeaponAttack extends AbstractAttackAction<HasTarget> {
  ability: AbilityName;

  constructor(
    g: Engine,
    nameBasis: string,
    actor: Combatant,
    rangeCategory: RangeCategory,
    public weapon: WeaponItem,
    public ammo?: AmmoItem,
    public attackTags?: SetInitialiser<AttackTag>,
  ) {
    super(
      g,
      actor,
      getWeaponAttackName(nameBasis, rangeCategory, weapon, ammo),
      rangeCategory === "ranged" && weapon.properties.has("thrown")
        ? "incomplete"
        : "implemented",
      weapon.name,
      rangeCategory,
      {
        target: new TargetResolver(
          g,
          getWeaponRange(actor, weapon, rangeCategory),
          [notSelf],
        ),
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
    const { actor, weapon, rangeCategory } = this;

    const rangeCategories: string[] = [];
    const ranges: string[] = [];

    if (rangeCategory === "melee") {
      rangeCategories.push("Melee");
      ranges.push(`reach ${getWeaponRange(actor, weapon, "melee")} ft.`);
    }
    if (rangeCategory === "ranged") {
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

  check(config: Partial<HasTarget>, ec: ErrorCollector) {
    if (this.weapon.properties.has("two-handed") && this.actor.freeHands < 1)
      ec.add("need two hands", this);

    return super.check(config, ec);
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
      rangeCategory: this.rangeCategory,
      tags: this.attackTags,
    });
  }
}

export const Versatile: Source = { name: "Versatile" };

export async function doStandardAttack(
  g: Engine,
  {
    ability,
    ammo,
    attacker,
    source,
    target,
    weapon,
    rangeCategory,
    tags: startTags,
  }: {
    ability: AbilityName;
    ammo?: AmmoItem;
    attacker: Combatant;
    source: Source;
    target: Combatant;
    weapon: WeaponItem;
    rangeCategory: RangeCategory;
    tags?: SetInitialiser<AttackTag>;
  },
) {
  const tags = new Set<AttackTag>(startTags);

  if (rangeCategory === "ranged") {
    tags.add("ranged");
    if (weapon.properties.has("thrown")) tags.add("thrown");
  } else {
    tags.add("melee");
  }

  if (weapon.category !== "natural") tags.add("weapon");
  if (weapon.magical || ammo?.magical) tags.add("magical");

  if (weapon.properties.has("two-handed")) tags.add("two hands");

  if (weapon.properties.has("versatile") && attacker.freeHands > 0)
    await new YesNoChoice(
      attacker,
      Versatile,
      "Versatile",
      `Use both hands to attack with ${attacker.name}'s ${weapon.name}?`,
      Priority.Normal,
      async () => tags.add("two hands").add("versatile"),
    ).apply(g);

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
  if (e.outcome === "cancelled") return { type: "cancelled" } as const;

  const {
    who: attacker,
    target,
    ability,
    weapon,
    ammo,
    tags,
  } = e.attack.roll.type;

  if (ammo) attacker.removeFromInventory(ammo, 1);

  if (tags.has("thrown") && weapon) {
    attacker.equipment.delete(weapon);
    // TODO [SPAWNITEMS] throwing
  }

  if (e.hit) {
    if (weapon) {
      const { damage } = weapon;

      const baseDamage: DamageInitialiser = [];

      if (damage.type === "dice") {
        let { size } = damage.amount;
        if (e.attack.roll.type.tags.has("versatile")) size += 2;

        const amount = await g.rollDamage(
          damage.amount.count,
          {
            source,
            size,
            damageType: damage.damageType,
            attacker,
            target,
            ability,
            weapon,
            tags,
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

export function meleeWeaponAttack(
  g: Engine,
  actor: Combatant,
  weapon: WeaponItem,
  tags?: SetInitialiser<AttackTag>,
) {
  if (weapon.rangeCategory === "ranged")
    throw new Error(`meleeWeaponAttack(${weapon.name})`);
  return new WeaponAttack(g, "Attack", actor, "melee", weapon, undefined, tags);
}

export function thrownWeaponAttack(
  g: Engine,
  actor: Combatant,
  weapon: WeaponItem,
  tags?: SetInitialiser<AttackTag>,
) {
  if (!weapon.properties.has("thrown"))
    throw new Error(`thrownWeaponAttack(${weapon.name})`);
  return new WeaponAttack(
    g,
    "Attack",
    actor,
    "ranged",
    weapon,
    undefined,
    tags,
  );
}

export function rangedWeaponAttack(
  g: Engine,
  actor: Combatant,
  weapon: WeaponItem,
  ammo: AmmoItem,
  tags?: SetInitialiser<AttackTag>,
) {
  if (weapon.rangeCategory !== "ranged")
    throw new Error(`rangedWeaponAttack(${weapon.name})`);
  return new WeaponAttack(g, "Attack", actor, "ranged", weapon, ammo, tags);
}
