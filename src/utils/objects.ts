import { deserialize, serialize } from "@ungap/structured-clone";

type Entries<T> = {
  [K in keyof T]-?: [K, T[K]];
}[keyof T][];

export const objectEntries = Object.entries as <T>(
  obj: Partial<T>,
) => Entries<T>;

export function matches<T>(object: T, match: Partial<T>) {
  for (const [field, value] of objectEntries(match)) {
    if (object[field] !== value) return false;
  }

  return true;
}

function getStructuredClone() {
  if (globalThis.structuredClone) return globalThis.structuredClone;
  return <T>(thing: T) => deserialize(serialize(thing)) as T;
}
export const clone = getStructuredClone();
