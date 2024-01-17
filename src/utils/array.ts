import { isDefined } from "./types";

export const sieve = <T>(...items: (T | undefined)[]) =>
  items.filter(isDefined);

export const uniq = <T>(items: T[]) => Array.from(new Set(items));
