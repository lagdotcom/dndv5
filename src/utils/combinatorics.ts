export function combinations<T>(source: T[], size: number): T[][] {
  const results: T[][] = [];

  function backtrack(start: number, current: T[]) {
    if (current.length === size) {
      results.push([...current]);
      return;
    }

    for (let i = start; i < source.length; i++) {
      current.push(source[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);

  return results;
}

export function combinationsMulti<T>(source: T[], min: number, max: number) {
  const v: T[][] = [];

  for (let l = min; l <= max; l++) v.push(...combinations(source, l));

  return v;
}
