import ErrorCollector from "../collectors/ErrorCollector";
import Action from "./Action";

type Resolver<T> = {
  type: string;
  check(
    value: T | unknown,
    action: Action,
    collector: ErrorCollector
  ): ErrorCollector;
};
export default Resolver;
