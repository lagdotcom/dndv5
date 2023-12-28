export function matches<T>(object: T, match: Partial<T>) {
  for (const [field, value] of Object.entries(match)) {
    if (object[field as keyof T] !== value) return false;
  }

  return true;
}
