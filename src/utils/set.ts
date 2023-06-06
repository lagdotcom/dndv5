export function hasAll<T>(set: Set<T> | undefined, matches: Iterable<T>) {
  if (!set) return false;

  for (const item of matches) if (!set.has(item)) return false;
  return true;
}

export function intersects<T>(a: Set<T>, b: Set<T>) {
  for (const item of a) if (b.has(item)) return true;
  return false;
}
