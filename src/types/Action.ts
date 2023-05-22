import ErrorCollector from "../collectors/ErrorCollector";
import ActionTime from "./ActionTime";
import Combatant from "./Combatant";

export type Resolver<T> = {
  type: string;
  check(value: unknown, action: Action): ErrorCollector;
};

export type ActionConfig<T> = { [K in keyof T]: Resolver<T[K]> };

interface Action<T extends object = object> {
  actor: Combatant;
  config: ActionConfig<T>;
  name: string;
  time?: ActionTime;

  apply(config: T): Promise<void>;
}
export default Action;
