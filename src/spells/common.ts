import { MarkOptional } from "ts-essentials";

import ErrorCollector from "../collectors/ErrorCollector";
import { Scales } from "../configs";
import SlotResolver from "../resolvers/SlotResolver";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";

export function getCantripDice(who: Combatant) {
  if (who.level < 5) return 1;
  if (who.level < 11) return 2;
  if (who.level < 17) return 3;
  return 4;
}

export const simpleSpell = <T extends object>({
  name,
  level,
  school,
  concentration = false,
  time = "action",
  v = false,
  s = false,
  m,
  lists,
  apply,
  check = (_g, _config, ec = new ErrorCollector()) => ec,
  getAffectedArea = () => undefined,
  getConfig,
  getDamage = () => undefined,
}: Omit<
  MarkOptional<
    Spell<T>,
    | "concentration"
    | "time"
    | "v"
    | "s"
    | "check"
    | "getAffectedArea"
    | "getDamage"
  >,
  "getLevel" | "scaling"
>): Spell<T> => ({
  name,
  level,
  scaling: false,
  school,
  concentration,
  time,
  v,
  s,
  m,
  lists,
  apply,
  check,
  getAffectedArea,
  getConfig,
  getDamage,
  getLevel() {
    return level;
  },
});

export const scalingSpell = <T extends object>({
  name,
  level,
  school,
  concentration = false,
  time = "action",
  v = false,
  s = false,
  m,
  lists,
  apply,
  check = (_g, _config, ec = new ErrorCollector()) => ec,
  getAffectedArea = () => undefined,
  getConfig,
  getDamage = () => undefined,
}: Omit<
  MarkOptional<
    Spell<T & Scales>,
    | "concentration"
    | "time"
    | "v"
    | "s"
    | "check"
    | "getAffectedArea"
    | "getDamage"
  >,
  "getConfig" | "getLevel" | "scaling"
> & { getConfig: Spell<T>["getConfig"] }): Spell<T & Scales> => ({
  name,
  level,
  scaling: true,
  school,
  concentration,
  time,
  v,
  s,
  m,
  lists,
  apply,
  check,
  getAffectedArea,
  getConfig(g, actor, method) {
    return {
      ...getConfig(g, actor, method),
      slot: new SlotResolver(this, method),
    };
  },
  getDamage,
  getLevel({ slot }) {
    return slot;
  },
});
