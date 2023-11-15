import { isDefined } from "./types";

export const sieve = <T>(...items: (T | undefined)[]) =>
  items.filter(isDefined);
