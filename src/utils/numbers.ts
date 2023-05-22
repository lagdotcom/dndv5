export function modulo(value: number, max: number) {
  // TODO negative numbers
  return value % max;
}

export function round(n: number, size: number) {
  return Math.floor(n / size) * size;
}

export function enumerate(min: number, max: number) {
  const values: number[] = [];
  for (let i = min; i <= max; i++) values.push(i);
  return values;
}
