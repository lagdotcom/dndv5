import { MarkRequired } from "ts-essentials";

import { MultiplierType } from "../collectors/MultiplierCollector";
import { HasCaster } from "../configs";
import { DamageInitialiser } from "../DamageMap";
import Engine, { EngineSaveConfig } from "../Engine";
import { AttackDetail } from "../events/AttackEvent";
import AbilityName from "../types/AbilityName";
import Action from "../types/Action";
import AttackTag, { atSet } from "../types/AttackTag";
import Combatant from "../types/Combatant";
import ConditionName from "../types/ConditionName";
import DamageAmount from "../types/DamageAmount";
import DamageType from "../types/DamageType";
import DiceType from "../types/DiceType";
import { AmmoItem, WeaponItem } from "../types/Item";
import RangeCategory from "../types/RangeCategory";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { SetInitialiser } from "../utils/set";
import MultiSaveEffect from "./MultiSaveEffect";

export default class SpellHelper<T extends object> {
  constructor(
    public g: Engine,
    public action: Action,
    public spell: Spell<T>,
    public method: SpellcastingMethod,
    public config: T,
    public caster = action.actor,
  ) {}

  get affected() {
    return this.spell.getAffected(this.g, this.caster, this.config);
  }
  get affectedArea() {
    return this.spell.getAffectedArea(this.g, this.caster, this.config) ?? [];
  }

  attack({
    target,
    diceType,
    type,
    weapon,
    ammo,
  }: {
    target: Combatant;
    diceType?: DiceType;
    type: RangeCategory;
    weapon?: WeaponItem;
    ammo?: AmmoItem;
  }) {
    const { g, caster: who, method, spell } = this;

    return g.attack(
      {
        who,
        target,
        ability: method.ability,
        tags: atSet(type, "spell", "magical"),
        spell,
        method,
        weapon,
        ammo,
      },
      { source: spell, diceType },
    );
  }

  getSaveConfig<E extends object>(
    e: Omit<
      EngineSaveConfig<E>,
      "source" | "type" | "attacker" | "spell" | "method"
    >,
  ) {
    const { caster: attacker, spell, method, config: spellConfig } = this;
    const tags = e.tags ?? ["magic"];
    return {
      source: spell,
      type: method.getSaveType(
        attacker,
        spell,
        (spellConfig as { slot?: number }).slot,
      ),
      attacker,
      spell,
      method,
      ...e,
      tags,
    };
  }

  save<E extends object>(
    e: Omit<
      EngineSaveConfig<E>,
      "source" | "type" | "attacker" | "spell" | "method"
    >,
  ) {
    return this.g.save(this.getSaveConfig(e));
  }

  async rollDamage({
    critical,
    damage = this.spell.getDamage(
      this.g,
      this.caster,
      this.method,
      this.config,
    ),
    target,
    tags: initialTags = [],
  }: {
    critical?: boolean;
    damage?: DamageAmount[];
    target?: Combatant;
    tags?: SetInitialiser<AttackTag>;
  } = {}) {
    const { g, caster: attacker, method, spell } = this;
    const tags = new Set(initialTags).add("magical").add("spell");
    const amounts: DamageInitialiser = [];

    if (damage) {
      for (const { type, amount, damageType } of damage)
        if (type === "dice") {
          const { count, size } = amount;
          const roll = await g.rollDamage(
            count,
            {
              source: spell,
              size,
              damageType,
              attacker,
              target,
              spell,
              method,
              tags,
            },
            critical,
          );
          amounts.push([damageType, roll]);
        } else amounts.push([damageType, amount]);
    }

    return amounts;
  }

  damage({
    ability,
    ammo,
    attack,
    critical,
    target,
    weapon,
    damageType,
    damageInitialiser,
    damageResponse,
  }: {
    ability?: AbilityName;
    ammo?: AmmoItem;
    attack?: AttackDetail;
    critical?: boolean;
    target: Combatant;
    weapon?: WeaponItem;
    damageType: DamageType;
    damageInitialiser?: DamageInitialiser;
    damageResponse?: MultiplierType;
  }) {
    const { g, caster: attacker, method, spell } = this;
    return g.damage(
      spell,
      damageType,
      {
        ability,
        ammo,
        attack,
        attacker,
        critical,
        method,
        spell,
        target,
        weapon,
      },
      damageInitialiser,
      damageResponse,
    );
  }

  async rollHeal({
    critical,
    target,
  }: {
    critical?: boolean;
    target?: Combatant;
  } = {}) {
    const { g, caster: actor, method, spell, config } = this;
    let total = 0;
    const heals = spell.getHeal(g, actor, method, config);

    if (heals) {
      for (const { type, amount } of heals)
        if (type === "dice") {
          const { count, size } = amount;
          const roll = await g.rollHeal(
            count,
            {
              source: spell,
              size,
              spell,
              method,
              actor,
              target,
            },
            critical,
          );
          total += roll;
        } else total += amount;
    }

    return total;
  }

  heal({
    amount,
    startingMultiplier,
    target,
  }: {
    amount: number;
    startingMultiplier?: MultiplierType;
    target: Combatant;
  }) {
    const { g, caster: actor, action, spell } = this;
    return g.heal(
      spell,
      amount,
      { action, actor, spell, target },
      startingMultiplier,
    );
  }

  getMultiSave<E extends HasCaster>({
    duration,
    conditions = [],
    tags = [],
    ...e
  }: MarkRequired<
    Omit<
      EngineSaveConfig<E>,
      "source" | "type" | "attacker" | "spell" | "method" | "who"
    >,
    "effect"
  > & {
    duration: number;
    conditions?: SetInitialiser<ConditionName>;
  }) {
    const { g, caster, method, spell, config: spellConfig } = this;
    tags.push("magic");
    return new MultiSaveEffect(
      g,
      caster,
      spell,
      spellConfig,
      method,
      e.effect,
      duration,
      conditions,
      (who, config) => this.getSaveConfig({ ...e, tags, who, config }),
    );
  }
}
