export function modulo(value: number, max: number) {
  // TODO negative numbers
  return value % max;
}

export function round(n: number, size: number) {
  return Math.floor(n / size) * size;
}

export function roundUp(n: number, size: number) {
  return Math.ceil(n / size) * size;
}

export function enumerate(min: number, max: number) {
  const values: number[] = [];
  for (let value = min; value <= max; value++) values.push(value);
  return values;
}

export function ordinal(n: number) {
  if (n >= 11 && n <= 13) return `${n}th`;

  const last = n % 10;
  switch (last) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function clamp<T extends number>(n: T, min: T, max: T) {
  return Math.min(max, Math.max(n, min)) as T;
}
