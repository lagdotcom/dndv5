import ErrorCollector from "../collectors/ErrorCollector";
import Action from "../types/Action";
import Empty from "../types/Empty";

export interface CheckActionDetail<T extends object> {
  action: Action<T>;
  config: Partial<T>;
  error: ErrorCollector;
}

export default class CheckActionEvent<
  T extends object = Empty,
> extends CustomEvent<CheckActionDetail<T>> {
  constructor(detail: CheckActionDetail<T>) {
    super("CheckAction", { detail });
  }
}
