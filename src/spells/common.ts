import { MarkOptional } from "ts-essentials";

import { Scales } from "../configs";
import Engine from "../Engine";
import SlotResolver from "../resolvers/SlotResolver";
import { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";
import Source from "../types/Source";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { enumerate } from "../utils/numbers";

export function getCantripDice(who: Combatant) {
  if (who.level < 5) return 1;
  if (who.level < 11) return 2;
  if (who.level < 17) return 3;
  return 4;
}

export const simpleSpell = <T extends object>({
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
  apply,
  check = (_g, _config, ec) => ec,
  generateHealingConfigs = () => [],
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
    | "generateHealingConfigs"
    | "getAffectedArea"
    | "getDamage"
    | "getHeal"
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
  apply,
  check,
  generateHealingConfigs,
  getAffectedArea,
  getConfig,
  getDamage,
  getHeal,
  getLevel() {
    return level;
  },
  getTargets,
});

export const scalingSpell = <T extends object>({
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
  icon,
  description,
  apply,
  check = (_g, _config, ec) => ec,
  generateHealingConfigs,
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
  >,
  "generateHealingConfigs" | "getConfig" | "getLevel" | "scaling"
> & {
  generateHealingConfigs?: (
    slot: number,
    targets: Combatant[],
    g: Engine,
    caster: Combatant,
    method: SpellcastingMethod,
  ) => T[];
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
  apply,
  check,
  generateHealingConfigs(g, caster, method, targets) {
    if (!generateHealingConfigs) return [];

    const minSlot = method.getMinSlot?.(this, caster) ?? level;
    const maxSlot = method.getMaxSlot?.(this, caster) ?? level;
    return enumerate(minSlot, maxSlot).flatMap((slot) =>
      generateHealingConfigs(slot, targets, g, caster, method).map(
        (config) => ({ ...config, slot }),
      ),
    );
  },
  getAffectedArea,
  getConfig(g, actor, method, config) {
    return {
      ...getConfig(g, actor, method, config),
      slot: new SlotResolver(this, method),
    };
  },
  getDamage,
  getHeal,
  getLevel({ slot }) {
    return slot;
  },
  getTargets,
});

export function spellImplementationWarning(spell: Spell, owner: Source) {
  if (spell.status === "incomplete")
    console.warn(`[Spell Not Complete] ${spell.name} (on ${owner.name})`);
  else if (spell.status === "missing")
    console.warn(`[Spell Missing] ${spell.name} (on ${owner.name})`);
}
