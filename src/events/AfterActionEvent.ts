import InterruptionCollector from "../collectors/InterruptionCollector";
import Action from "../types/Action";

export interface AfterActionDetail<T extends object> {
  action: Action<T>;
  config: T;
  interrupt: InterruptionCollector;
}

export default class AfterActionEvent<
  T extends object = object
> extends CustomEvent<AfterActionDetail<T>> {
  constructor(detail: AfterActionDetail<T>) {
    super("AfterAction", { detail });
  }
}
