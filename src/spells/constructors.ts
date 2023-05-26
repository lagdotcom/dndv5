import { MarkOptional } from "ts-essentials";
import { Scales } from "../configs";
import Spell from "../types/Spell";
import SlotResolver from "../resolvers/SlotResolver";
import ErrorCollector from "../collectors/ErrorCollector";

export const simpleSpell = <T extends object>({
  name,
  level,
  school,
  concentration = false,
  time,
  v = false,
  s = false,
  m,
  apply,
  check = (_, ec = new ErrorCollector()) => ec,
  getAffectedArea = () => undefined,
  getConfig,
}: Omit<
  MarkOptional<
    Spell<T>,
    "concentration" | "v" | "s" | "check" | "getAffectedArea"
  >,
  "getLevel"
>) => ({
  name,
  level,
  school,
  concentration,
  time,
  v,
  s,
  m,
  apply,
  check,
  getAffectedArea,
  getConfig,
  getLevel() {
    return level;
  },
});

export const scalingSpell = <T extends object>({
  name,
  level,
  school,
  concentration = false,
  time,
  v = false,
  s = false,
  m,
  apply,
  check = (_, ec = new ErrorCollector()) => ec,
  getAffectedArea = () => undefined,
  getConfig,
}: Omit<
  MarkOptional<
    Spell<T & Scales>,
    "concentration" | "v" | "s" | "check" | "getAffectedArea"
  >,
  "getConfig" | "getLevel"
> & { getConfig: Spell<T>["getConfig"] }): Spell<T & Scales> => ({
  name,
  level,
  school,
  concentration,
  time,
  v,
  s,
  m,
  apply,
  check,
  getAffectedArea,
  getConfig(g, method) {
    return { ...getConfig(g, method), slot: new SlotResolver(this, method) };
  },
  getLevel({ slot }) {
    return slot;
  },
});
