import { MarkOptional } from "ts-essentials";

import { Scales } from "../configs";
import Engine from "../Engine";
import SlotResolver from "../resolvers/SlotResolver";
import { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";
import Source from "../types/Source";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

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
  icon,
  apply,
  check = (_g, _config, ec) => ec,
  getAffectedArea = () => undefined,
  getConfig,
  getDamage = () => undefined,
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
    | "check"
    | "getAffectedArea"
    | "getDamage"
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
  icon,
  apply,
  check,
  getAffectedArea,
  getConfig,
  getDamage,
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
  apply,
  check = (_g, _config, ec) => ec,
  getAffectedArea = () => undefined,
  getConfig,
  getDamage = () => undefined,
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
    | "check"
    | "getAffectedArea"
    | "getDamage"
  >,
  "getConfig" | "getLevel" | "scaling"
> & {
  getConfig: (
    g: Engine,
    actor: Combatant,
    method: SpellcastingMethod,
    config: Partial<T & Scales>
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
  icon,
  apply,
  check,
  getAffectedArea,
  getConfig(g, actor, method, config) {
    return {
      ...getConfig(g, actor, method, config),
      slot: new SlotResolver(this, method),
    };
  },
  getDamage,
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
