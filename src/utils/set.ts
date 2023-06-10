export function hasAll<T>(set: Set<T> | undefined, matches: Iterable<T>) {
  if (!set) return false;

  for (const item of matches) if (!set.has(item)) return false;
  return true;
}

export function intersects<T>(a: Set<T>, b: Set<T>) {
  for (const item of a) if (b.has(item)) return true;
  return false;
}

export function* mapSet<T, V>(
  values: Iterable<T>,
  fn: (value: T, index: number, values: Iterable<T>) => V
) {
  let index = 0;
  for (const item of values) yield fn(item, index++, values);
}

export function* filterSet<T>(
  values: Iterable<T>,
  predicate: (value: T) => boolean
) {
  for (const value of values) if (predicate(value)) yield value;
}
