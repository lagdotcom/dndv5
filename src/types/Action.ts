import Engine from "../Engine";

export type Resolver<T> = { check(value: unknown): value is T };

export type ActionConfig<T> = { [K in keyof T]: Resolver<T[K]> };

interface Action<T extends object = object> {
  config: ActionConfig<T>;
  name: string;

  apply(g: Engine, config: T): Promise<void>;
}
export default Action;
