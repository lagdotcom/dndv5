import ErrorCollector from "../collectors/ErrorCollector";
import Action from "./Action";

export default interface Resolver<T> {
  type: string;
  initialValue?: T;
  check(
    value: T | unknown,
    action: Action,
    collector: ErrorCollector,
  ): ErrorCollector;
}
