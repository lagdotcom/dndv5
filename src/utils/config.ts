import Engine from "../Engine";
import Action from "../types/Action";
import Resolver from "../types/Resolver";

export function getConfigErrors<T extends object>(
  g: Engine,
  action: Action<T>,
  config: Partial<T>,
) {
  const ec = g.check(action, config);
  action.check(config, ec);

  for (const [key, resolver] of Object.entries(action.getConfig(config))) {
    const value = config[key as keyof T] as unknown;
    (resolver as Resolver<unknown>).check(value, action, ec);
  }

  return ec;
}

export function checkConfig<T extends object>(
  g: Engine,
  action: Action<T>,
  config: Partial<T>,
): config is T {
  return getConfigErrors(g, action, config).result;
}
