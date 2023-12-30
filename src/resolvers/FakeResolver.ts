import ErrorCollector from "../collectors/ErrorCollector";
import Action from "../types/Action";
import Resolver from "../types/Resolver";

export default class FakeResolver<T> implements Resolver<T> {
  type: "FAKE";

  constructor(public name: string) {
    this.type = "FAKE";
  }

  check(value: unknown, action: Action, ec: ErrorCollector): ErrorCollector {
    if (!value) ec.add("blank", this);

    return ec;
  }
}
