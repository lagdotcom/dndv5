export function orderedKeys<K, V>(
  map: Map<K, V>,
  comparator: (a: [K, V], b: [K, V]) => number,
) {
  const entries = [];
  for (const entry of map) entries.push(entry);

  entries.sort(comparator);
  return entries.map(([k]) => k);
}
