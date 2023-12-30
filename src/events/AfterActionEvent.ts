import InterruptionCollector from "../collectors/InterruptionCollector";
import Action from "../types/Action";
import Empty from "../types/Empty";

export interface AfterActionDetail<T extends object> {
  action: Action<T>;
  config: T;
  interrupt: InterruptionCollector;
}

export default class AfterActionEvent<
  T extends object = Empty,
> extends CustomEvent<AfterActionDetail<T>> {
  constructor(detail: AfterActionDetail<T>) {
    super("AfterAction", { detail });
  }
}
