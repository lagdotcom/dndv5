import { isDefined } from "./types";

export const patchAt = <T>(
  items: T[],
  index: number,
  transformer: (old: T) => T,
) =>
  items
    .slice(0, index)
    .concat(transformer(items[index]), ...items.slice(index + 1));

export const exceptFor = <T>(items: T[], index: number) =>
  items.slice(0, index).concat(...items.slice(index + 1));

export const sieve = <T>(...items: (T | undefined)[]) =>
  items.filter(isDefined);
