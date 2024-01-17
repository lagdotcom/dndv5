import Engine from "../Engine";
import Action, { ActionConfig } from "../types/Action";
import { objectEntries } from "./objects";

export function getConfigErrors<T extends object>(
  g: Engine,
  action: Action<T>,
  config: Partial<T>,
) {
  const ec = g.check(action, config);

  for (const [key, resolver] of objectEntries<ActionConfig<T>>(
    action.getConfig(config),
  )) {
    const value = config[key] as unknown;
    resolver.check(value, action, ec);
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
