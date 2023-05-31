import ErrorCollector from "../collectors/ErrorCollector";
import Action, { Resolver } from "../types/Action";

export function check<T extends object>(action: Action<T>, config: Partial<T>) {
  const ec = new ErrorCollector();
  action.check(config, ec);

  for (const [key, resolver] of Object.entries(action.getConfig(config))) {
    const value = config[key as keyof T] as unknown;
    (resolver as Resolver<unknown>).check(value, action, ec);
  }

  return ec;
}

export function checkConfig<T extends object>(
  action: Action<T>,
  config: Partial<T>
): config is T {
  return check(action, config).valid;
}
