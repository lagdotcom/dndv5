import Action, { Resolver } from "../types/Action";

export function checkConfig<T extends object>(
  action: Action<T>,
  config: object
): config is T {
  for (const [key, resolver] of Object.entries(action.config)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const value = config[key] as unknown;
    if (!(resolver as Resolver<unknown>).check(value)) return false;
  }

  return true;
}
