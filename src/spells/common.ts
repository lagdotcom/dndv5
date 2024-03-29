import { MarkOptional } from "ts-essentials";

import { Scales } from "../configs";
import Engine from "../Engine";
import { SpellSlot } from "../flavours";
import SlotResolver from "../resolvers/SlotResolver";
import { ActionConfig, ConfigWithPositioning } from "../types/Action";
import Combatant from "../types/Combatant";
import { ctSet } from "../types/CreatureType";
import Empty from "../types/Empty";
import ImplementationStatus from "../types/ImplementationStatus";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { implementationWarning } from "../utils/env";
import { enumerate } from "../utils/numbers";

export const cannotHealConventionally = ctSet("undead", "construct");

export function getCantripDice(who: Combatant) {
  if (who.level < 5) return 1;
  if (who.level < 11) return 2;
  if (who.level < 17) return 3;
  return 4;
}

export const simpleSpell = <T extends object = Empty>({
  name,
  level,
  ritual = false,
  school,
  concentration = false,
  time = "action",
  v = false,
  s = false,
  m,
  lists,
  description,
  icon,
  isHarmful = false,
  apply,
  check = (_g, _config, ec) => ec,
  generateAttackConfigs = () => [],
  generateHealingConfigs = () => [],
  getAffected,
  getAffectedArea = () => undefined,
  getConfig,
  getDamage = () => undefined,
  getHeal = () => undefined,
  getTargets,
  status = "missing",
}: Omit<
  MarkOptional<
    Spell<T>,
    | "status"
    | "concentration"
    | "ritual"
    | "time"
    | "v"
    | "s"
    | "description"
    | "check"
    | "generateAttackConfigs"
    | "generateHealingConfigs"
    | "getAffectedArea"
    | "getDamage"
    | "getHeal"
    | "isHarmful"
  >,
  "getLevel" | "scaling"
>): Spell<T> => ({
  status,
  name,
  level,
  ritual,
  scaling: false,
  school,
  concentration,
  time,
  v,
  s,
  m,
  lists,
  description,
  icon,
  isHarmful,
  apply,
  check,
  generateAttackConfigs,
  generateHealingConfigs,
  getAffected,
  getAffectedArea,
  getConfig,
  getDamage,
  getHeal,
  getLevel() {
    return level as SpellSlot;
  },
  getTargets,
});

type ConfigGenerator<T> = (config: {
  slot: SpellSlot;
  allTargets: Combatant[];
  g: Engine;
  caster: Combatant;
  method: SpellcastingMethod;
}) => ConfigWithPositioning<T>[];

export const scalingSpell = <T extends object = Empty>({
  name,
  level,
  ritual = false,
  school,
  concentration = false,
  time = "action",
  v = false,
  s = false,
  m,
  lists,
  description,
  icon,
  isHarmful = false,
  apply,
  check = (_g, _config, ec) => ec,
  generateAttackConfigs,
  generateHealingConfigs,
  getAffected,
  getAffectedArea = () => undefined,
  getConfig,
  getDamage = () => undefined,
  getHeal = () => undefined,
  getTargets,
  status = "missing",
}: Omit<
  MarkOptional<
    Spell<T & Scales>,
    | "status"
    | "concentration"
    | "ritual"
    | "time"
    | "v"
    | "s"
    | "description"
    | "check"
    | "getAffectedArea"
    | "getDamage"
    | "getHeal"
    | "isHarmful"
  >,
  | "generateAttackConfigs"
  | "generateHealingConfigs"
  | "getConfig"
  | "getLevel"
  | "scaling"
> & {
  generateAttackConfigs?: ConfigGenerator<T>;
  generateHealingConfigs?: ConfigGenerator<T>;
  getConfig: (
    g: Engine,
    actor: Combatant,
    method: SpellcastingMethod,
    config: Partial<T & Scales>,
  ) => ActionConfig<T>;
}): Spell<T & Scales> => ({
  status,
  name,
  level,
  ritual,
  scaling: true,
  school,
  concentration,
  time,
  v,
  s,
  m,
  lists,
  description,
  icon,
  isHarmful,
  apply,
  check,
  generateAttackConfigs({ g, allTargets, caster, method }) {
    if (!generateAttackConfigs) return [];

    const minSlot = method.getMinSlot?.(this, caster) ?? level;
    const maxSlot = method.getMaxSlot?.(this, caster) ?? level;
    return enumerate(minSlot, maxSlot).flatMap((slot) =>
      generateAttackConfigs({ slot, allTargets, g, caster, method }).map(
        ({ config, positioning }) => ({
          config: { ...config, slot },
          positioning,
        }),
      ),
    );
  },
  generateHealingConfigs({ g, allTargets, caster, method }) {
    if (!generateHealingConfigs) return [];

    const minSlot = method.getMinSlot?.(this, caster) ?? level;
    const maxSlot = method.getMaxSlot?.(this, caster) ?? level;
    return enumerate(minSlot, maxSlot).flatMap((slot) =>
      generateHealingConfigs({ slot, allTargets, g, caster, method }).map(
        ({ config, positioning }) => ({
          config: { ...config, slot },
          positioning,
        }),
      ),
    );
  },
  getAffected,
  getAffectedArea,
  getConfig(g, actor, method, config) {
    return {
      ...getConfig(g, actor, method, config),
      slot: new SlotResolver(this, actor, method),
    } as ActionConfig<T & Scales>;
  },
  getDamage,
  getHeal,
  getLevel({ slot }) {
    return slot;
  },
  getTargets,
});

export function spellImplementationWarning(
  spell: { name: string; status: ImplementationStatus },
  who: { name: string },
) {
  const status =
    spell.status === "incomplete"
      ? "Not Complete"
      : spell.status === "missing"
        ? "Missing"
        : "";

  if (status) implementationWarning("Spell", status, spell.name, who.name);
}
