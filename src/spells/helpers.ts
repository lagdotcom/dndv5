import { aimCone, aimLine } from "../aim";
import { HasPoint, HasTarget, HasTargets, Scales } from "../configs";
import { ErrorFilter } from "../filters";
import { DiceCount, DiceSize, Feet, SpellSlot } from "../flavours";
import MultiTargetResolver from "../resolvers/MultiTargetResolver";
import PointResolver from "../resolvers/PointResolver";
import TargetResolver from "../resolvers/TargetResolver";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import DamageType from "../types/DamageType";
import { SpecifiedEffectShape } from "../types/EffectArea";
import Point from "../types/Point";
import RangeCategory from "../types/RangeCategory";
import Spell from "../types/Spell";
import { poSet, poWithin } from "../utils/ai";
import { sieve } from "../utils/array";
import { _dd } from "../utils/dice";
import { getCantripDice } from "./common";

export const doesCantripDamage = (
  size: DiceSize,
  damageType: DamageType,
): Pick<Spell, "isHarmful" | "getDamage"> => ({
  isHarmful: true,
  getDamage: (g, caster) => [_dd(getCantripDice(caster), size, damageType)],
});

export const doesScalingDamage = (
  level: SpellSlot,
  diceMinusSlot: DiceCount,
  size: DiceSize,
  damageType: DamageType,
): Pick<Spell<Scales>, "isHarmful" | "getDamage"> => ({
  isHarmful: true,
  getDamage: (g, caster, method, { slot }) => [
    _dd((slot ?? level) + diceMinusSlot, size, damageType),
  ],
});

// TODO show save info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const requiresSave = (ability: AbilityName) => ({});

// TODO show attack info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isSpellAttack = (category: RangeCategory) => ({});

export const affectsSelf: Pick<
  Spell,
  "getConfig" | "getTargets" | "getAffected"
> = {
  getConfig: () => ({}),
  getTargets: () => [],
  getAffected: (g, caster) => [caster],
};

export const targetsByTouch = (
  filters: ErrorFilter<Combatant>[],
): Pick<Spell<HasTarget>, "getConfig" | "getTargets" | "getAffected"> => ({
  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, filters),
  }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],
});

export const targetsOne = (
  range: Feet,
  filters: ErrorFilter<Combatant>[],
): Pick<Spell<HasTarget>, "getConfig" | "getTargets" | "getAffected"> => ({
  getConfig: (g) => ({ target: new TargetResolver(g, range, filters) }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],
});

export const targetsMany = (
  min: number,
  max: number,
  range: Feet,
  filters: ErrorFilter<Combatant>[],
  allFilters?: ErrorFilter<Combatant[]>[],
): Pick<Spell<HasTargets>, "getConfig" | "getTargets" | "getAffected"> => ({
  getConfig: (g) => ({
    targets: new MultiTargetResolver(g, min, max, range, filters, allFilters),
  }),
  getTargets: (g, caster, { targets }) => targets ?? [],
  getAffected: (g, caster, { targets }) => targets,
});

export const affectsStaticArea = (
  getArea: (caster: Combatant) => SpecifiedEffectShape,
  ignoreCaster = true,
): Pick<
  Spell,
  "getConfig" | "getTargets" | "getAffectedArea" | "getAffected"
> => ({
  getConfig: () => ({}),
  getTargets: () => [],
  getAffectedArea: (g, caster) => [getArea(caster)],
  getAffected: (g, caster) =>
    g.getInside(getArea(caster), ignoreCaster ? [caster] : undefined),
});

export const affectsCone = (
  range: Feet,
  ignoreCaster = true,
  getArea = (caster: Combatant, point: Point) =>
    aimCone(caster.position, caster.sizeInUnits, point, range),
): Pick<
  Spell<HasPoint>,
  "getConfig" | "getTargets" | "getAffectedArea" | "getAffected"
> => ({
  getConfig: (g) => ({ point: new PointResolver(g, range) }),
  getTargets: () => [],
  getAffectedArea: (g, caster, { point }) => point && [getArea(caster, point)],
  getAffected: (g, caster, { point }) =>
    g.getInside(getArea(caster, point), ignoreCaster ? [caster] : undefined),
});

export const affectsLine = (
  length: Feet,
  width: Feet,
  ignoreCaster = true,
  getArea = (caster: Combatant, point: Point) =>
    aimLine(caster.position, caster.sizeInUnits, point, length, width),
): Pick<
  Spell<HasPoint>,
  "getConfig" | "getTargets" | "getAffectedArea" | "getAffected"
> => ({
  getConfig: (g) => ({ point: new PointResolver(g, length) }),
  getTargets: () => [],
  getAffectedArea: (g, caster, { point }) => point && [getArea(caster, point)],
  getAffected: (g, caster, { point }) =>
    g.getInside(getArea(caster, point), ignoreCaster ? [caster] : undefined),
});

export const affectsByPoint = (
  range: Feet,
  getArea: (point: Point) => SpecifiedEffectShape,
  ignoreCaster = true,
): Pick<
  Spell<HasPoint>,
  "getConfig" | "getTargets" | "getAffectedArea" | "getAffected"
> => ({
  getConfig: (g) => ({ point: new PointResolver(g, range) }),
  getTargets: () => [],
  getAffectedArea: (g, caster, { point }) => point && [getArea(point)],
  getAffected: (g, caster, { point }) =>
    g.getInside(getArea(point), ignoreCaster ? [caster] : undefined),
});

export const aiTargetsOne =
  (range: Feet): Spell<HasTarget>["generateAttackConfigs"] =>
  ({ allTargets }) =>
    allTargets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(range, target)),
    }));

export const aiTargetsByTouch: Spell<HasTarget>["generateAttackConfigs"] = ({
  allTargets,
  caster,
}) =>
  allTargets.map((target) => ({
    config: { target },
    positioning: poSet(poWithin(caster.reach, target)),
  }));
