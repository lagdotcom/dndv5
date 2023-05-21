export function isDefined<T>(value?: T): value is T {
  return typeof value !== "undefined";
}

export function isA<T extends string>(
  value: string,
  enumeration: readonly T[]
): value is T {
  return enumeration.includes(value as T);
}
