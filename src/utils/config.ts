import Action, { Resolver } from "../types/Action";

export function checkConfig<T extends object>(
  action: Action<T>,
  config: Partial<T>
): config is T {
  for (const [key, resolver] of Object.entries(action.config)) {
    const value = config[key as keyof T] as unknown;
    if (!(resolver as Resolver<unknown>).check(value, action).valid)
      return false;
  }

  return true;
}
