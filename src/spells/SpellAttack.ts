import { DamageInitialiser } from "../DamageMap";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import DamageType from "../types/DamageType";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class SpellAttack<T extends object> {
  attackResult?: Awaited<ReturnType<Engine["attack"]>>;
  baseDamageType?: DamageType;

  constructor(
    public g: Engine,
    public caster: Combatant,
    public spell: Spell<T>,
    public method: SpellcastingMethod,
    public type: "melee" | "ranged",
    public config: T
  ) {}

  async attack(target: Combatant) {
    const { caster: who, method, spell, type } = this;

    this.attackResult = await this.g.attack({
      who,
      target,
      ability: method.ability,
      type,
      spell,
      method,
    });

    return this.attackResult;
  }

  async getDamage(target?: Combatant) {
    if (!this.attackResult) throw new Error("Run .attack() first");
    const { critical } = this.attackResult;
    const { g, caster: attacker, config, method, spell } = this;

    const damage = spell.getDamage(g, attacker, config);

    if (damage) {
      const amounts: DamageInitialiser = [];
      let first = true;

      for (const { type, amount, damageType } of damage) {
        if (first) {
          this.baseDamageType = damageType;
          first = false;
        }

        if (type === "dice") {
          const { count, size } = amount;
          const roll = await g.rollDamage(
            count,
            { size, damageType, attacker, target, spell, method },
            critical
          );
          amounts.push([damageType, roll]);
        } else amounts.push([damageType, amount]);
      }

      return amounts;
    }
  }

  async damage(target: Combatant, initialiser?: DamageInitialiser) {
    if (!this.attackResult) throw new Error("Run .attack() first");
    const { attack, critical, hit } = this.attackResult;
    if (!hit) return;
    const { g, baseDamageType, caster: attacker, method, spell } = this;
    if (!baseDamageType) throw new Error("Run .getDamage() first");

    const damageResult = await g.damage(
      spell,
      baseDamageType,
      { attack, attacker, target, critical, spell, method },
      initialiser
    );

    return damageResult;
  }
}
